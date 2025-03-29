import _ from 'lodash';
import { Edge } from 'react-flow-renderer';
import type { Node } from 'reactflow';
import { setup, enqueueActions, assign } from 'xstate';

import {
  editIAMPolicyNode,
  editObjectiveState,
  changeLevelObjectiveProgress,
  createIAMUserGroupNode,
  createIAMRoleNode,
  getElementsWithRedDot,
} from './utils/common-state-machine-actions';
import {
  refreshPolicyConnections,
  updateConnectionEdges,
} from './utils/edges-creation-state-machine-actions';
import { deleteConnectionEdges } from './utils/edges-deletion-state-machine-actions';
import { resolveInitialEdges } from './utils/initial-edges-resolver';
import { createPermissionPolicy } from './utils/nodes-creation-state-machine-actions';
import { deleteNode } from './utils/nodes-deletion-state-machine-actions';
import { ElementID } from '@/config/element-ids';
import type {
  AccountID,
  BaseFinishEventMap,
  EdgeConnectionObjective,
  IAMRoleCreationObjective,
  PopoverTutorialMessage,
  PopupTutorialMessage,
} from '@/machines/types';
import type {
  GenericContext,
  GenericEventData,
  LevelObjective,
  IAMPolicyCreationObjective,
} from '@/machines/types';
import {
  IAMAnyNodeData,
  IAMEdgeData,
  IAMGroupNodeData,
  IAMNodeEntity,
  IAMPolicyNodeData,
  IAMUserNodeData,
} from '@/types';
import { getEdgeName } from '@/utils/names';

/**
 * Defines a common state machine setup for all levels
 *
 * This is best way in which we can share common actions among different state machines
 * without having to redefine the same actions in each one, which would surely be harder to maintain.
 * We still need to define the various top-level events for each state machine,
 * ie: `ADD_IAM_USER_NODE`, `ADD_IAM_POLICY_NODE`, etc.
 * Unfortunately, we can't share those definitions across state machines without losing typescript's type safety.
 * It all boils down to losing the contextual typing magic, which xstate heavily relies on.
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
>(
  popoverTutorialMessages: PopoverTutorialMessage[],
  popupTutorialMessages: PopupTutorialMessage[],
  policyCreationObjectives: IAMPolicyCreationObjective<TFinishEventMap>[][],
  roleCreationObjectives: IAMRoleCreationObjective<TFinishEventMap>[][],
  edgeConnectionObjectives: EdgeConnectionObjective<TFinishEventMap>[][]
) => {
  return setup({
    types: {} as {
      context: GenericContext<TLevelObjectiveID, TFinishEventMap>;
      events: GenericEventData<TFinishEventMap>;
    },
    guards: {
      no_unnecessary_edges: ({ context }) => {
        return context.edges.every(edge => !edge.data?.unnecessary_edge);
      },
      no_unnecessary_nodes: ({ context }) => {
        return context.nodes.every(edge => !edge.data?.unnecessary_node);
      },
    },
    actions: {
      connect_nodes: enqueueActions(
        (
          { context, enqueue },
          {
            sourceNode,
            targetNode,
          }: {
            sourceNode: Node<IAMAnyNodeData>;
            targetNode: Node<IAMAnyNodeData>;
          }
        ) => {
          const { updatedContext, events } = updateConnectionEdges<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, sourceNode, targetNode);

          const updatedEdges = _.chain(updatedContext.edges)
            .sortBy(e => e.data?.unnecessary_edge)
            .uniqBy('id')
            .value();

          enqueue.assign({
            nodes_connnections: updatedContext.nodes_connnections,
            edges: updatedEdges,
          });

          events.forEach(event => enqueue.raise({ type: event }));
        }
      ),
      delete_edge: enqueueActions(({ context, enqueue }, { edge }: { edge: Edge<IAMEdgeData> }) => {
        const { updatedContext } = deleteConnectionEdges<TLevelObjectiveID, TFinishEventMap>(
          context,
          [edge.id]
        );

        enqueue.assign({ edges: updatedContext.edges });
      }),
      delete_node: enqueueActions(
        ({ context, enqueue }, { node }: { node: Node<IAMAnyNodeData> }) => {
          let { updatedContext } = deleteNode<TLevelObjectiveID, TFinishEventMap>(context, node);

          const edgesToDelete = updatedContext.nodes_connnections
            .filter(connection => connection.from.id === node.id || connection.to.id === node.id)
            .map(connection => getEdgeName(connection.from.id, connection.to.id));

          ({ updatedContext } = deleteConnectionEdges<TLevelObjectiveID, TFinishEventMap>(
            updatedContext,
            edgesToDelete
          ));

          enqueue.assign({
            nodes: updatedContext.nodes,
            edges: updatedContext.edges,
            nodes_connnections: updatedContext.nodes_connnections,
          });
        }
      ),
      add_iam_user_group_node: enqueueActions(
        (
          { context, enqueue },
          {
            nodeType,
            params,
          }: {
            nodeType: IAMNodeEntity.Group | IAMNodeEntity.User;
            params: Partial<IAMUserNodeData> | Partial<IAMGroupNodeData>;
          }
        ) => {
          const [updatedNodes, updatedObjectives, sideEffectsEvents] = createIAMUserGroupNode<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, nodeType, params);

          enqueue.assign({ nodes: updatedNodes });
          enqueue.assign({ user_group_creation_objectives: updatedObjectives });
          sideEffectsEvents.forEach(event => enqueue.raise({ type: event }));
        }
      ),
      add_policy_node: enqueueActions(
        (
          { context, enqueue },
          {
            docString,
            label,
            accountId,
          }: { docString: string; accountId?: AccountID; label: string }
        ) => {
          const createPermissionPolicyResult = createPermissionPolicy(
            context,
            docString,
            label,
            accountId
          );

          const { updatedContext } = createPermissionPolicyResult;
          enqueue.assign({
            nodes: updatedContext.nodes,
            edges: updatedContext.edges,
            nodes_connnections: updatedContext.nodes_connnections,
          });

          createPermissionPolicyResult.events.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      update_iam_policy_node: enqueueActions(
        ({ context, enqueue }, { docString, nodeId }: { docString: string; nodeId: string }) => {
          const editPolicyResult = editIAMPolicyNode<TLevelObjectiveID, TFinishEventMap>(
            context,
            nodeId,
            docString
          );

          let { updatedContext } = editPolicyResult;
          const nodeEditFinishEvents = editPolicyResult.nodeEditFinishEvents;

          ({ updatedContext } = refreshPolicyConnections(
            updatedContext,
            updatedContext.nodes.find(node => node.id === nodeId) as Node<IAMPolicyNodeData>
          ));

          enqueue.assign({
            nodes: updatedContext.nodes,
            edges: updatedContext.edges,
            nodes_connnections: updatedContext.nodes_connnections,
          });

          nodeEditFinishEvents.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      add_role_node: enqueueActions(
        (
          { context, enqueue },
          {
            docString,
            label,
            accountId,
          }: { docString: string; label: string; accountId?: AccountID }
        ) => {
          const [updatedNodes, updatedObjectives, sideEffectsEvents] = createIAMRoleNode<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, docString, label, accountId);

          enqueue.assign({ nodes: updatedNodes, role_creation_objectives: updatedObjectives });
          sideEffectsEvents.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      next_popover: assign({
        popover_content: ({ context }) => popoverTutorialMessages[context.next_popover_index ?? 0],
        show_popovers: ({ context }) => context.next_popover_index < popoverTutorialMessages.length,
        next_popover_index: ({ context }) => context.next_popover_index + 1,
        show_popups: false,
      }),
      next_popup: assign({
        popup_content: ({ context }) => popupTutorialMessages[context.next_popup_index],
        show_popups: ({ context }) => context.next_popup_index < popupTutorialMessages.length,
        next_popup_index: ({ context }) => context.next_popup_index + 1,
        show_popovers: false,
      }),
      show_fixed_popover: assign({
        show_fixed_popovers: ({ context }) =>
          context.next_fixed_popover_index < context.fixed_popover_messages.length,
      }),
      hide_fixed_popovers: assign({ show_fixed_popovers: false }),
      next_fixed_popover: assign({
        next_fixed_popover_index: ({ context }) => context.next_fixed_popover_index + 1,
        show_fixed_popovers: ({ context }) =>
          context.next_fixed_popover_index < context.fixed_popover_messages.length,
      }),
      next_policy_creation_objectives: assign({
        policy_creation_objectives: ({ context }) =>
          policyCreationObjectives[context.next_policy_creation_objectives_index ?? 0],
        next_policy_creation_objectives_index: ({ context }) =>
          (context.next_policy_creation_objectives_index ?? 0) + 1,
      }),
      next_role_creation_objectives: assign({
        role_creation_objectives: ({ context }) =>
          roleCreationObjectives[context.next_role_creation_objectives_index ?? 0],
        next_role_creation_objectives_index: ({ context }) =>
          (context.next_role_creation_objectives_index ?? 0) + 1,
      }),
      hide_popups: assign({ show_popups: false }),
      hide_popovers: assign({ show_popovers: false }),
      change_objective_progress: assign({
        level_objectives: ({ context }, { id, finished }: { id: string; finished: boolean }) =>
          changeLevelObjectiveProgress(context, id, finished),
      }),
      add_new_level_objective: assign({
        level_objectives: (
          { context },
          { objectives }: { objectives: LevelObjective<TLevelObjectiveID, TFinishEventMap>[] }
        ) => [...context.level_objectives, ...objectives],
      }),
      finish_level_objective: assign({
        level_objectives: ({ context }, { id }: { id: string }) =>
          editObjectiveState(context, id, true),
      }),
      add_iam_node: assign({
        nodes: ({ context }, { node }: { node: Node<IAMAnyNodeData> }) => [...context.nodes, node],
      }),
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
      next_edge_connection_objectives: assign({
        edges_connection_objectives: ({ context }) =>
          edgeConnectionObjectives[context.next_edges_connection_objectives_index ?? 0],
        next_edges_connection_objectives_index: ({ context }) =>
          (context.next_edges_connection_objectives_index ?? 0) + 1,
      }),
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
      resolve_initial_edges: enqueueActions(({ context, enqueue }) => {
        const initialEdgesConfig = resolveInitialEdges(context);

        enqueue.assign({
          edges: initialEdgesConfig.edges,
          nodes_connnections: initialEdgesConfig.nodes_connections,
        });
      }),
      assign_nodes: assign({
        nodes: ({ context }, { nodes }: { nodes: Node<IAMAnyNodeData>[] }) => nodes,
      }),
      set_mutli_account_canvas: assign({
        use_multi_account_canvas: true,
      }),
    },
  });
};
