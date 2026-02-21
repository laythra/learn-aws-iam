import _ from 'lodash';
import { enqueueActions, assign, setup, AnyActorLogic, Actor } from 'xstate';

import { applyInitialNodeConnections } from './utils/apply-initial-edges-state-machine-actions';
import { editObjectiveState, getElementsWithRedDot } from './utils/common-state-machine-actions';
import {
  applyGuardRailBlockingToEdges,
  deleteConnectionEdges,
  updateConnectionEdges,
} from './utils/edges-creation-state-machine-actions';
import { createIAMNode, createUserGroupNode } from './utils/nodes-creation-state-machine-actions';
import { deleteNode } from './utils/nodes-deletion-state-machine-actions';
import {
  editNodeAttributes,
  editPermissionPolicy,
} from './utils/nodes-editing-state-machine-actions';
import {
  aggregateUserNodes,
  deaggregateUserNodes,
} from './utils/user-node-aggregation-state-machine-actions';
import { storeLevelCheckpoint, saveSnapshotToDisk } from '@/app_shell/runtime/level-operations';
import { ElementID } from '@/config/element-ids';
import type { GenericContext } from '@/levels/types/context-types';
import type { GenericEventData } from '@/levels/types/event-types';
import type {
  BaseCreationObjective,
  BaseFinishEventMap,
  EdgeConnectionObjective,
  IAMPolicyEditObjective,
  IAMUserGroupCreationObjective,
  LevelObjective,
} from '@/levels/types/objective-types';
import type {
  FixedPopoverMessage,
  PopoverTutorialMessage,
  PopupTutorialMessage,
} from '@/levels/types/tutorial-message-types';
import { analyticsActor } from '@/lib/analytics-actor';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMAnyNode, IAMEdge, IAMGroupNode, IAMUserNode } from '@/types/iam-node-types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

/**
 * Defines a common state machine setup for all levels
 *
 * This is best way through which we can share common actions among different state machines
 * without having to redefine the same actions in each one, which would surely be harder to maintain.
 * We still need to define the various top-level events for each state machine,
 * ie: `ADD_IAM_USER_NODE`, `ADD_IAM_POLICY_NODE`, etc.
 * Unfortunately, we can't share those definitions across state machines without losing typescript's type safety.
 * It all boils down to losing typescript's contextual typing, which xstate heavily relies on.
 * check the github issue: https://github.com/statelyai/xstate/issues/4846
 * @template TLevelObjectiveID - Type of level objective ID, will be passed to the generic context
 * @template TFinishEventMap - Defines the event finish type for each objective type, will be passed to the generic context
 * @param popoverTutorialMessages - List of popover tutorial messages
 * @param popupTutorialMessages - List of popup tutorial messages
 * @param policyCreationObjectives - List of policy role creation objectives
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createStateMachineSetup = <
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>() => {
  return setup({
    types: {} as {
      context: GenericContext<TLevelObjectiveID, TFinishEventMap>;

      // Doing `{ type: (TFinishEventMap[keyof TFinishEventMap] & string) }` to "expand" the state machine setup
      // with the level specific events. Each level has its own custom finish events defined in TFinishEventMap.
      // Since unfortuantely, XState provides no idiomatic way to extend state machine setups with custom events.
      // I am not fond of this approach, the generic type causes descriminated unions narrowing to not work properly
      // since the concrete types are not provided in place, so typescript has no way of removing the generic branch when narrowing on compile time.
      // This limitation is preventing me from utilizing xstate's `createStateConfig` utlility to establish common
      // modular typed state nodes. If anyone is reading this and has a better idea, SOS!
      events: GenericEventData | { type: TFinishEventMap[keyof TFinishEventMap] & string };
      emitted:
        | {
            type: 'OBJECTIVE_COMPLETED';
            message: string;
            objective_id: string;
          }
        | {
            type: 'EDGES_DELETED';
            edgeIds: string[];
          }
        | {
            type: 'EDGES_RESET';
            edges: IAMEdge[];
          }
        | {
            type: 'EDGES_ADDED';
            edges: IAMEdge[];
          }
        | {
            type: 'NODES_DELETED';
            nodeIds: string[];
          }
        | {
            type: 'NODES_RESET';
            nodes: IAMAnyNode[];
          }
        | {
            type: 'NODES_ADDED';
            nodes: IAMAnyNode[];
          }
        | {
            type: 'NODE_UPDATED';
            node: IAMAnyNode;
          }
        | {
            type: 'EDGES_UPDATED';
            edges: IAMEdge[];
          };
    },
    guards: {
      no_unnecessary_edges: ({ context }) => {
        return context.edges.every(edge => !edge.data?.unnecessary_edge);
      },
      no_unnecessary_nodes: ({ context }) => {
        return context.nodes.every(node => !node.data?.unnecessary_node);
      },
    },
    actions: {
      connect_nodes: enqueueActions(
        (
          { context, enqueue },
          {
            sourceNode,
            targetNode,
            isInternalConnection,
          }: {
            sourceNode: IAMAnyNode;
            targetNode: IAMAnyNode;
            isInternalConnection?: boolean;
          }
        ) => {
          const { updatedContext, events, newlyAddedEdges } = updateConnectionEdges<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, sourceNode, targetNode, isInternalConnection ?? false);

          const { edgesAfterBlocking } = applyGuardRailBlockingToEdges(
            updatedContext.edges,
            updatedContext.nodes,
            context.level_number
          );

          enqueue.assign({
            edges: edgesAfterBlocking,
          });

          enqueue.emit(() => ({
            type: 'EDGES_ADDED',
            edges: _.intersectionBy(edgesAfterBlocking, newlyAddedEdges, 'id'),
          }));

          enqueue.emit(() => ({
            type: 'EDGES_UPDATED',
            edges: _.differenceBy(edgesAfterBlocking, newlyAddedEdges, 'id'),
          }));

          events.forEach(event => enqueue.raise({ type: event }));
        }
      ),
      edit_node_attributes: enqueueActions(
        (
          { context, enqueue },
          {
            nodeId,
            attributes,
          }: {
            nodeId: string;
            attributes: IAMNodeDataOverrides<IAMAnyNode['data']>;
          }
        ) => {
          const { updatedContext, editedNode } = editNodeAttributes<
            TLevelObjectiveID,
            TFinishEventMap,
            IAMAnyNode
          >(context, nodeId, attributes);

          enqueue.assign({
            nodes: updatedContext.nodes,
          });

          enqueue.emit(() => ({
            type: 'NODE_UPDATED',
            node: editedNode,
          }));
        }
      ),
      delete_edge: enqueueActions(({ context, enqueue }, { edge }: { edge: IAMEdge }) => {
        const {
          updatedContext: { edges },
          deletedEdges,
        } = deleteConnectionEdges(context, [edge.id]);

        enqueue.assign({ edges });
        enqueue.emit(() => ({
          type: 'EDGES_DELETED',
          edgeIds: deletedEdges.map(e => e.id),
        }));
      }),
      delete_edges: enqueueActions(({ context, enqueue }, { edgeIds }: { edgeIds: string[] }) => {
        const {
          updatedContext: { edges },
          deletedEdges,
        } = deleteConnectionEdges(context, edgeIds);

        enqueue.assign({ edges });
        enqueue.emit(() => ({
          type: 'EDGES_DELETED',
          edgeIds: deletedEdges.map(e => e.id),
        }));
      }),
      delete_node: enqueueActions(({ context, enqueue }, { node }: { node: IAMAnyNode }) => {
        let { updatedContext } = deleteNode<TLevelObjectiveID, TFinishEventMap>(context, node);
        let deletedEdges: IAMEdge[] = [];

        const edgesToDelete = updatedContext.edges
          .filter(edge => edge.source === node.id || edge.target === node.id)
          .map(edge => edge.id);

        ({ updatedContext, deletedEdges } = deleteConnectionEdges(updatedContext, edgesToDelete));

        enqueue.assign({ nodes: updatedContext.nodes, edges: updatedContext.edges });
        enqueue.emit(() => ({
          type: 'NODES_DELETED',
          nodeIds: [node.id],
        }));

        enqueue.emit(() => ({
          type: 'EDGES_DELETED',
          edgeIds: deletedEdges.map(edge => edge.id),
        }));
      }),
      delete_nodes: enqueueActions(({ context, enqueue }, { nodeIds }: { nodeIds: string[] }) => {
        // Might be better to batch process deletions here for performance
        nodeIds.forEach(nodeId => {
          const node = context.nodes.find(n => n.id === nodeId);
          if (node) {
            enqueue.raise({
              type: StatefulStateMachineEvent.DeleteNode,
              node,
            });
          }
        });
      }),
      add_iam_user_group_node: enqueueActions(
        (
          { context, enqueue },
          {
            nodeType,
            params,
          }: {
            nodeType: IAMNodeEntity.Group | IAMNodeEntity.User;
            params:
              | IAMNodeDataOverrides<IAMUserNode['data']>
              | IAMNodeDataOverrides<IAMGroupNode['data']>;
          }
        ) => {
          const { updatedContext, events, createdNode } = createUserGroupNode(
            context,
            nodeType,
            params
          );

          enqueue.assign({
            nodes: updatedContext.nodes,
            user_group_creation_objectives: updatedContext.user_group_creation_objectives,
          });
          enqueue.emit(() => ({
            type: 'NODES_ADDED',
            nodes: [createdNode],
          }));
          events.forEach(event => enqueue.raise({ type: event }));
        }
      ),
      set_user_group_creation_objectives: assign({
        user_group_creation_objectives: (
          __,
          { objectives }: { objectives: IAMUserGroupCreationObjective<TFinishEventMap>[] }
        ) => objectives,
      }),
      edit_policy_node: enqueueActions(
        ({ context, enqueue }, { docString, nodeId }: { docString: string; nodeId: string }) => {
          const editPolicyResult = editPermissionPolicy<TLevelObjectiveID, TFinishEventMap>(
            context,
            nodeId,
            docString
          );

          let { updatedContext } = editPolicyResult;
          const edgesToRecreate: IAMEdge[] = [];

          // Remove edges affected by the policy change
          const edgeIdsToDelete = editPolicyResult.edgesToRefresh.map(edge => edge.id);
          ({ updatedContext } = deleteConnectionEdges<TLevelObjectiveID, TFinishEventMap>(
            updatedContext,
            edgeIdsToDelete
          ));

          const nodeById = _.keyBy(updatedContext.nodes, 'id');

          // Recreate edges based on updated policy
          editPolicyResult.edgesToRefresh.forEach(edge => {
            const sourceNode = nodeById[edge.source];
            const targetNode = nodeById[edge.target];
            let recreatedEdges: IAMEdge[];

            ({ updatedContext, newlyAddedEdges: recreatedEdges } = updateConnectionEdges<
              TLevelObjectiveID,
              TFinishEventMap
            >(updatedContext, sourceNode, targetNode, true));

            edgesToRecreate.push(...recreatedEdges);
          });

          enqueue.assign({
            nodes: updatedContext.nodes,
            edges: updatedContext.edges,
            policy_edit_objectives: updatedContext.policy_edit_objectives,
          });

          // Only emit edges that didn't exist before
          const newEdges = _.differenceBy(updatedContext.edges, context.edges, 'id');
          const removedEdges = _.differenceBy(context.edges, updatedContext.edges, 'id');
          const updatedEdges = _.intersectionBy(updatedContext.edges, context.edges, 'id');

          if (newEdges.length > 0) {
            enqueue.emit({
              type: 'EDGES_ADDED',
              edges: newEdges,
            });
          }

          if (removedEdges.length > 0) {
            enqueue.emit({
              type: 'EDGES_DELETED',
              edgeIds: removedEdges.map(edge => edge.id),
            });
          }

          if (editPolicyResult.updatedNode) {
            enqueue.emit({
              type: 'NODE_UPDATED',
              node: editPolicyResult.updatedNode,
            });
          }

          if (updatedEdges.length > 0) {
            enqueue.emit({
              type: 'EDGES_UPDATED',
              edges: updatedEdges,
            });
          }

          editPolicyResult.events.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      show_popup_message: enqueueActions(
        ({ enqueue }, { message }: { message: PopupTutorialMessage }) => {
          enqueue.assign({
            popup_content: message,
            show_popups: true,
          });
        }
      ),
      show_popover_message: enqueueActions(
        ({ enqueue }, { message }: { message: PopoverTutorialMessage }) => {
          enqueue.assign({
            popover_content: message,
            show_popovers: true,
          });
        }
      ),
      show_fixed_popover_message: enqueueActions(
        ({ enqueue }, { message }: { message: FixedPopoverMessage }) => {
          enqueue.assign({
            fixed_popover_content: message,
            show_fixed_popovers: true,
          });
        }
      ),
      hide_fixed_popovers: assign({ show_fixed_popovers: false }),
      hide_popups: assign({ show_popups: false }),
      hide_popovers: assign({ show_popovers: false }),
      hide_node_help_tooltip: enqueueActions(({ enqueue }, { nodeId }: { nodeId: string }) => {
        enqueue.raise({
          type: StatefulStateMachineEvent.EditNodeMetadata,
          nodeId,
          newMetadata: { alert_message: undefined },
        });
      }),
      append_level_objectives: assign({
        level_objectives: (
          { context },
          { objectives }: { objectives: LevelObjective<TLevelObjectiveID, TFinishEventMap>[] }
        ) => [...context.level_objectives, ...objectives],
      }),
      set_level_objectives: assign({
        level_objectives: (
          __,
          { objectives }: { objectives: LevelObjective<TLevelObjectiveID, TFinishEventMap>[] }
        ) => objectives,
      }),
      set_restricted_element_ids: assign({
        restricted_element_ids: (__, { element_ids }: { element_ids: ElementID[] }) => element_ids,
      }),
      finish_level_objective: enqueueActions(({ context, enqueue }, { id }: { id: string }) => {
        const updatedLevelObjectives = editObjectiveState(context, id, true);

        enqueue.assign({
          level_objectives: updatedLevelObjectives,
        });

        // Emit event to notify `ObjectiveCompletePopover` components about objective progress change
        enqueue.emit(({ context: emissionCtx }) => ({
          type: 'OBJECTIVE_COMPLETED',
          message: emissionCtx.level_objectives.find(obj => obj.id === id)!.label,
          objective_id: id,
        }));

        // Log objective completion analytics event
        enqueue.raise({
          type: StatefulStateMachineEvent.LogAnalyticsEvent,
          name: 'OBJECTIVE_COMPLETED',
          payload: {
            objective_id: id,
            objective_label: context.level_objectives.find(obj => obj.id === id)?.label,
          },
        });
      }),
      add_iam_node: enqueueActions(
        (
          { context, enqueue },
          {
            docString,
            label,
            accountId,
            policyNodeType,
          }: {
            docString: string;
            accountId?: string;
            label: string;
            policyNodeType: IAMCodeDefinedEntity;
          }
        ) => {
          const createPolicyResult = createIAMNode(
            context,
            docString,
            label,
            policyNodeType,
            accountId
          );

          const { updatedContext, edgesToCreate, createdNode } = createPolicyResult;
          const updatedContextNodes = updatedContext.nodes;
          const nodesById = _.keyBy(updatedContextNodes, 'id');

          enqueue.assign({
            nodes: updatedContextNodes,
            policy_creation_objectives: updatedContext.policy_creation_objectives,
          });

          createPolicyResult.events.forEach(event => {
            // TS can't narrow a generic index access type, even when the constraint guarantees it
            enqueue.raise({ type: event as TFinishEventMap[keyof TFinishEventMap] & string });
          });

          edgesToCreate.forEach(edge => {
            enqueue.raise({
              type: StatefulStateMachineEvent.ConnectNodes,
              sourceNode: nodesById[edge.from],
              targetNode: nodesById[edge.to],
              isInternalConnection: true,
            });
          });

          enqueue.emit(() => ({
            type: 'NODES_ADDED',
            nodes: [createdNode],
          }));
        }
      ),
      show_popover: assign({
        popover_content: (
          _context_obj,
          { popover_content }: { popover_content: PopoverTutorialMessage }
        ) => popover_content,
        show_popovers: true,
      }),
      toggle_side_panel: assign({
        side_panel_open: ({ context }) => !context.side_panel_open,
        elements_with_animated_red_dot: ({ context }) =>
          context.elements_with_animated_red_dot?.filter(
            element => element != ElementID.RightSidePanelToggleButton
          ),
      }),
      show_side_panel: assign({ side_panel_open: true }),
      close_side_panel: assign({ side_panel_open: false }),
      append_creation_objectives: assign({
        policy_creation_objectives: (
          { context },
          { objectives }: { objectives: BaseCreationObjective<TFinishEventMap>[] }
        ) => [...context.policy_creation_objectives, ...objectives],
      }),
      append_edit_objectives: assign({
        policy_edit_objectives: (
          { context },
          { objectives }: { objectives: IAMPolicyEditObjective<TFinishEventMap>[] }
        ) => [...context.policy_edit_objectives, ...objectives],
      }),
      set_creation_objectives: assign({
        policy_creation_objectives: (
          {},
          { objectives }: { objectives: BaseCreationObjective<TFinishEventMap>[] }
        ) => objectives,
      }),
      set_edge_connection_objectives: enqueueActions(
        (
          { enqueue },
          { objectives }: { objectives: EdgeConnectionObjective<TFinishEventMap>[] }
        ) => {
          enqueue.assign({
            edges_connection_objectives: objectives,
          });
        }
      ),
      set_permission_policy_edit_objectives: enqueueActions(
        (
          { enqueue },
          { objectives }: { objectives: IAMPolicyEditObjective<TFinishEventMap>[] }
        ) => {
          enqueue.assign({
            policy_edit_objectives: objectives,
          });
        }
      ),
      enable_edges_management_ability: assign({ edges_management_disabled: false }),
      disable_edges_management_ability: assign({ edges_management_disabled: true }),
      enable_tutorial_state: assign({ in_tutorial_state: true }),
      disable_tutorial_state: assign({ in_tutorial_state: false }),
      update_whitelisted_element_ids: assign({
        whitelisted_element_ids: (
          {},
          { whitelisted_element_ids }: { whitelisted_element_ids: string[] }
        ) => whitelisted_element_ids,
        in_tutorial_state: true,
      }),
      append_whitelisted_element_ids: assign({
        whitelisted_element_ids: (
          { context },
          { whitelisted_element_ids }: { whitelisted_element_ids: string[] }
        ) => [...(context.whitelisted_element_ids || []), ...whitelisted_element_ids],
      }),
      update_red_dot_visibility: assign({
        elements_with_animated_red_dot: (
          { context },
          { elementIds, isVisible }: { elementIds: ElementID[]; isVisible: boolean }
        ) => {
          return getElementsWithRedDot(context, elementIds, isVisible);
        },
      }),
      show_unncessary_edges_or_nodes_warning: assign({
        show_unncessary_edges_or_nodes_warning: true,
      }),
      hide_unncessary_edges_or_nodes_warning: assign({
        show_unncessary_edges_or_nodes_warning: false,
      }),
      clear_edges: enqueueActions(({ context, enqueue }) => {
        enqueue.raise({
          type: StatefulStateMachineEvent.DeleteEdges,
          edgeIds: context.edges.map(edge => edge.id),
        });
      }),
      clear_nodes: assign({ nodes: [] }),
      clear_creation_objectives: assign({
        policy_creation_objectives: [],
      }),
      apply_initial_node_connections: enqueueActions(
        (
          { context, enqueue },
          { initialConnections }: { initialConnections: { from: string; to: string }[] }
        ) => {
          const initialEdgesConfig = applyInitialNodeConnections(context, initialConnections);

          enqueue.assign({
            edges: initialEdgesConfig.edges,
          });

          enqueue.emit(() => ({
            type: 'EDGES_RESET',
            edges: initialEdgesConfig.edges,
          }));
        }
      ),
      // TODO: Should we create an initial nodes resolver action just like we have for edges? check `apply_initial_node_connections` action
      // Beneficial for performing side effects, if any, when nodes are added.
      assign_nodes: enqueueActions(({ enqueue }, { nodes }: { nodes: IAMAnyNode[] }) => {
        enqueue.assign({ nodes });

        enqueue.emit(() => ({
          type: 'NODES_RESET',
          nodes,
        }));
      }),
      append_nodes: enqueueActions(({ context, enqueue }, { nodes }: { nodes: IAMAnyNode[] }) => {
        const updatedNodes = [...context.nodes, ...nodes];

        enqueue.assign({
          nodes: updatedNodes,
        });

        enqueue.emit(() => ({
          type: 'NODES_ADDED',
          nodes,
        }));
      }),
      update_restricted_element_ids: assign({
        restricted_element_ids: (
          {},
          { restricted_element_ids }: { restricted_element_ids: string[] }
        ) => restricted_element_ids,
      }),
      remove_restricted_element_ids: assign({
        restricted_element_ids: ({ context }, { element_ids }: { element_ids: string[] }) =>
          context.restricted_element_ids?.filter(id => !element_ids.includes(id)),
      }),
      add_restricted_element_ids: assign({
        restricted_element_ids: ({ context }, { element_ids }: { element_ids: string[] }) => [
          ...(context.restricted_element_ids || []),
          ...element_ids,
        ],
      }),
      update_blocked_connections: assign({
        blocked_connections: (
          {},
          { blocked_connections }: { blocked_connections: { from: string; to: string }[] }
        ) => blocked_connections,
      }),
      store_checkpoint: enqueueActions(({ self }) => {
        queueMicrotask(() => storeLevelCheckpoint(self as Actor<AnyActorLogic>));
      }),
      aggregate_user_nodes: enqueueActions(({ context, enqueue }) => {
        const updatedContext = aggregateUserNodes<TLevelObjectiveID, TFinishEventMap>(context);

        enqueue.assign({
          nodes: updatedContext.nodes,
          edges: updatedContext.edges,
        });
      }),
      deaggregate_user_nodes: enqueueActions(
        ({ context, enqueue }, { nodeId }: { nodeId: string }) => {
          const updatedContext = deaggregateUserNodes<TLevelObjectiveID, TFinishEventMap>(
            context,
            nodeId
          );

          enqueue.assign({
            nodes: updatedContext.nodes,
            edges: updatedContext.edges,
          });
        }
      ),
      // TODO: Remove this! Only used for testing and debugging purposes.
      store_snapshot_to_disk: enqueueActions(({ self }, { filename }: { filename: string }) => {
        queueMicrotask(() => {
          saveSnapshotToDisk(self as Actor<AnyActorLogic>, filename);
        });
      }),
      log_analytics_event: enqueueActions(
        (
          { enqueue, context },
          {
            name,
            payload,
          }: {
            name: string;
            payload: Record<string, unknown>;
          }
        ) => {
          enqueue.sendTo(() => analyticsActor, {
            type: 'LOG_EVENT',
            name,
            payload: {
              ...payload,
              levelNumber: context.level_number,
            },
          });
        }
      ),
    },
  });
};
