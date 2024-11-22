import type { Node } from 'reactflow';
import { setup, enqueueActions, assign } from 'xstate';

import {
  attachPolicyToUser,
  updatePolicyToUserConnectionEdges,
  editIAMPolicyNode,
  editObjectiveState,
  createIAMPolicyNode,
  changeLevelObjectiveProgress,
  createIAMUserNode,
} from './utils/common-state-machine-actions';
import type {
  BaseFinishEventMap,
  EdgeConnectionObjective,
  PopoverTutorialMessage,
  PopupTutorialMessage,
} from '@/machines/types';
import type {
  GenericContext,
  GenericEventData,
  LevelObjective,
  IAMPolicyRoleCreationObjective,
} from '@/machines/types';
import { IAMAnyNodeData, IAMPolicyNodeData, IAMUserNodeData } from '@/types';

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
 * @param policyRoleCreationObjectives - List of policy role creation objectives
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createStateMachineSetup = <
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  popoverTutorialMessages: PopoverTutorialMessage[],
  popupTutorialMessages: PopupTutorialMessage[],
  policyRoleCreationObjectives: IAMPolicyRoleCreationObjective<TFinishEventMap>[][],
  edgeConnectionObjectives: EdgeConnectionObjective<TFinishEventMap>[][]
) => {
  return setup({
    types: {} as {
      context: GenericContext<TLevelObjectiveID, TFinishEventMap>;
      events: GenericEventData<TFinishEventMap>;
    },
    actions: {
      attach_policy_to_user: enqueueActions(
        (
          { context, enqueue },
          {
            userNode,
            policyNode,
          }: { userNode: Node<IAMUserNodeData>; policyNode: Node<IAMPolicyNodeData> }
        ) => {
          const updatedNodes = attachPolicyToUser(context, policyNode, userNode);
          const [updatedEdges, sideEffectsEvents] = updatePolicyToUserConnectionEdges<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, policyNode, userNode);

          enqueue.assign({ nodes: updatedNodes, edges: updatedEdges });
          sideEffectsEvents.forEach(event => {
            enqueue.raise({ type: event });
          });
        }
      ),
      add_iam_user_node: enqueueActions(
        ({ context, enqueue }, { params }: { params: Partial<IAMUserNodeData> }) => {
          const [updatedNodes, sideEffectsEvents] = createIAMUserNode<
            TLevelObjectiveID,
            TFinishEventMap
          >(context, params);

          enqueue.assign({ nodes: updatedNodes });
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
      next_policy_role_objectives: assign({
        policy_role_objectives: ({ context }) =>
          policyRoleCreationObjectives[context.next_policy_role_objectives_index ?? 0],
        next_policy_role_objectives_index: ({ context }) =>
          (context.next_policy_role_objectives_index ?? 0) + 1,
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
          {
            id,
            objective,
          }: { id: string; objective: LevelObjective<TLevelObjectiveID, TFinishEventMap> }
        ) => ({
          ...context.level_objectives,
          [id]: objective,
        }),
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
