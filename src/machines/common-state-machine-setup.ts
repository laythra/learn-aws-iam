import _ from 'lodash';
import { setup, enqueueActions, assign, AnyActorLogic, Actor } from 'xstate';

import { applyInitialNodeConnections } from './utils/apply-initial-edges-state-machine-actions';
import { editObjectiveState, getElementsWithRedDot } from './utils/common-state-machine-actions';
import { updateConnectionEdges } from './utils/edges-creation-state-machine-actions';
import { deleteConnectionEdges } from './utils/edges-deletion-state-machine-actions';
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
import { ElementID } from '@/config/element-ids';
import type {
  BaseCreationObjective,
  BaseFinishEventMap,
  EdgeConnectionObjective,
  FixedPopoverMessage,
  IAMPolicyEditObjective,
  IAMUserGroupCreationObjective,
  PopoverTutorialMessage,
  PopupTutorialMessage,
} from '@/machines/types';
import type { GenericContext, GenericEventData, LevelObjective } from '@/machines/types';
import currentLevelDetailsStore from '@/stores/current-level-details-store';
import { IAMNodeEntity } from '@/types';
import {
  IAMAnyNode,
  IAMCodeDefinedEntity,
  IAMEdge,
  IAMGroupNode,
  IAMPolicyNode,
  IAMUserNode,
} from '@/types/iam-node-types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

/**
 * Defines a common state machine setup for all levels
 *
 * This is best way in which we can share common actions among different state machines
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
      events: GenericEventData<TFinishEventMap>;
      emitted: {
        type: 'OBJECTIVE_COMPLETED';
        message: string;
        objective_id: string;
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
          const { updatedContext, events } = updateConnectionEdges<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, sourceNode, targetNode, isInternalConnection ?? false);

          const updatedEdges = _.chain(updatedContext.edges)
            .sortBy(e => e.data?.unnecessary_edge)
            .uniqBy('id')
            .value();

          enqueue.assign({
            edges: updatedEdges,
          });

          events.forEach(event => enqueue.raise({ type: event }));
        }
      ),
      edit_policy_node_attributes: enqueueActions(
        (
          { context, enqueue },
          {
            nodeId,
            attributes,
          }: {
            nodeId: string;
            attributes: Partial<IAMPolicyNode['data']>;
          }
        ) => {
          const updatedContext = editNodeAttributes<
            TLevelObjectiveID,
            TFinishEventMap,
            IAMPolicyNode
          >(context, nodeId, attributes);

          enqueue.assign({
            nodes: updatedContext.nodes,
          });
        }
      ),
      delete_edge: enqueueActions(({ context, enqueue }, { edge }: { edge: IAMEdge }) => {
        const { updatedContext } = deleteConnectionEdges<TLevelObjectiveID, TFinishEventMap>(
          context,
          [edge.id]
        );

        enqueue.assign({ edges: updatedContext.edges });
      }),
      delete_node: enqueueActions(({ context, enqueue }, { node }: { node: IAMAnyNode }) => {
        const { updatedContext } = deleteNode<TLevelObjectiveID, TFinishEventMap>(context, node);

        enqueue.assign({
          nodes: updatedContext.nodes,
          edges: updatedContext.edges,
        });
      }),
      delete_nodes: enqueueActions(({ context, enqueue }, { nodeIds }: { nodeIds: string[] }) => {
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
            params: Partial<IAMUserNode['data']> | Partial<IAMGroupNode['data']>;
          }
        ) => {
          const { updatedContext, events } = createUserGroupNode(context, nodeType, params);

          enqueue.assign({
            nodes: updatedContext.nodes,
            user_group_creation_objectives: updatedContext.user_group_creation_objectives,
          });
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

          const { updatedContext } = editPolicyResult;

          enqueue.assign({
            nodes: updatedContext.nodes,
            edges: updatedContext.edges,
            policy_edit_objectives: updatedContext.policy_edit_objectives,
          });

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

          const { updatedContext, edgesToCreate } = createPolicyResult;
          const updatedContextNodes = updatedContext.nodes;
          const nodesById = _.keyBy(updatedContextNodes, 'id');

          enqueue.assign({
            nodes: updatedContextNodes,
            policy_creation_objectives: updatedContext.policy_creation_objectives,
          });

          createPolicyResult.events.forEach(event => {
            // TODO:  Remove the `as` cast
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
      clear_edges: assign({ edges: [] }),
      clear_nodes: assign({ nodes: [] }),
      clear_creation_objectives: assign({
        policy_creation_objectives: [],
      }),
      // TODO: Create an initial nodes resolver just like we have for edges
      // Benificial for performing side effects when nodes are added, such as creating their associated edges and whatnot
      apply_initial_node_connections: enqueueActions(
        (
          { context, enqueue },
          { initialConnections }: { initialConnections: { from: string; to: string }[] }
        ) => {
          const initialEdgesConfig = applyInitialNodeConnections(context, initialConnections);

          enqueue.assign({
            edges: initialEdgesConfig.edges,
          });
        }
      ),
      assign_nodes: assign({
        nodes: (__, { nodes }: { nodes: IAMAnyNode[] }) => nodes,
      }),
      append_nodes: assign({
        nodes: ({ context }, { nodes }: { nodes: IAMAnyNode[] }) => [...context.nodes, ...nodes],
      }),
      // TODO: What's the difference between this and `set_restricted_element_ids`?
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
      hide_help_popover: assign({
        show_help_popover: false,
      }),
      show_help_popover: assign({
        show_help_popover: true,
      }),
      store_checkpoint: enqueueActions(({ self }) => {
        queueMicrotask(() => {
          currentLevelDetailsStore.send({
            type: 'storeLevelProgress',
            actor: self as Actor<AnyActorLogic>,
          });
        });
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
          currentLevelDetailsStore.send({
            type: 'storeSnapshotAtDisk',
            actor: self as Actor<AnyActorLogic>,
            filename,
          });
        });
      }),
    },
  });
};
