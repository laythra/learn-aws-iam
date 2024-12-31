import _ from 'lodash';
import type { Node } from 'reactflow';
import { setup, enqueueActions, assign } from 'xstate';

import {
  editIAMPolicyNode,
  editObjectiveState,
  createIAMPolicyNode,
  changeLevelObjectiveProgress,
  createIAMUserGroupNode,
  attachPolicyToEntity,
  updatePolicyToEntityConnectionEdges,
  attachUserToGroup,
  updateUserToGroupConnectionEdges,
  createIAMRoleNode,
  attachRoleToEntity,
  updateRoleToEntityConnectionEdges,
} from './utils/common-state-machine-actions';
import type {
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
  IAMGroupNodeData,
  IAMNodeEntity,
  IAMPolicyNodeData,
  IAMRoleNodeData,
  IAMUserNodeData,
} from '@/types';

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
    actions: {
      attach_policy_to_entity: enqueueActions(
        (
          { context, enqueue },
          {
            entityNode,
            policyNode,
          }: {
            entityNode: Node<IAMUserNodeData | IAMGroupNodeData | IAMRoleNodeData>;
            policyNode: Node<IAMPolicyNodeData>;
          }
        ) => {
          const updatedNodes = attachPolicyToEntity(context, policyNode, entityNode);
          const updatedNode = updatedNodes.find(node => node.id === entityNode.id)!;
          const [updatedEdges, sideEffectsEvents] = updatePolicyToEntityConnectionEdges<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, policyNode, updatedNode);

          enqueue.assign({ nodes: updatedNodes, edges: _.uniqBy(updatedEdges, 'id') });
          sideEffectsEvents.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      attach_role_to_user: enqueueActions(
        (
          { context, enqueue },
          {
            userNode,
            roleNode,
          }: {
            userNode: Node<IAMUserNodeData>;
            roleNode: Node<IAMRoleNodeData>;
          }
        ) => {
          const updatedNodes = attachRoleToEntity(context, roleNode, userNode);
          const [updatedEdges, sideEffectsEvents] = updateRoleToEntityConnectionEdges<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, roleNode, userNode);

          enqueue.assign({ nodes: updatedNodes, edges: updatedEdges });
          sideEffectsEvents.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      attach_user_to_group: enqueueActions(
        (
          { context, enqueue },
          {
            userNode,
            groupNode,
          }: {
            userNode: Node<IAMUserNodeData>;
            groupNode: Node<IAMGroupNodeData>;
          }
        ) => {
          const updatedNodes = attachUserToGroup(context, userNode, groupNode);
          const [updatedEdges, sideEffectsEvents] = updateUserToGroupConnectionEdges<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, userNode, groupNode);

          enqueue.assign({ nodes: updatedNodes, edges: updatedEdges });
          sideEffectsEvents.forEach(event => {
            enqueue.raise({ type: event });
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
        ({ context, enqueue }, { docString }: { docString: string }) => {
          const [updatedNodes, sideEffectsEvents] = createIAMPolicyNode<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, docString);

          enqueue.assign({ nodes: updatedNodes });
          sideEffectsEvents.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      update_iam_policy_node: enqueueActions(
        ({ context, enqueue }, { docString, nodeId }: { docString: string; nodeId: string }) => {
          const [updatedNodes, updatedEdges, sideEffectsEvents] = editIAMPolicyNode<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, nodeId, docString);

          enqueue.assign({ nodes: updatedNodes, edges: updatedEdges });
          sideEffectsEvents.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      add_role_node: enqueueActions(
        (
          { context, enqueue },
          { docString, policies }: { docString: string; policies: string[] }
        ) => {
          const [updatedNodes, sideEffectsEvents] = createIAMRoleNode<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, docString, policies);

          enqueue.assign({ nodes: updatedNodes });
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
      toggle_side_panel: assign({ side_panel_open: ({ context }) => !context.side_panel_open }),
      show_side_panel: assign({ side_panel_open: true }),
      next_edge_connection_objectives: assign({
        edges_connection_objectives: ({ context }) =>
          edgeConnectionObjectives[context.next_edges_connection_objectives_index ?? 0],
      }),
    },
  });
};
