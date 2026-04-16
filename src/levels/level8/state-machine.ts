import { INITIAL_IN_LEVEL_CONNECTIONS } from './initial-connections';
import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_EDIT_OBJECTIVES } from './objectives/policy-edit-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap, PolicyEditFinishEvent } from './types/finish-event-enums';
import { PolicyNodeID } from './types/node-ids';
import { LevelObjectiveID } from './types/objective-enums';
import { ElementID } from '@/config/element-ids';
import { DataEvent, VoidEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level8_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'IAM Conditions and Principal Tags',
    level_description:
      'Use policy conditions to restrict secret access by username and principal tags.',
    level_number: 8,
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: [],
    policy_creation_objectives: [],
    edges_connection_objectives: [],
    policy_edit_objectives: [],
    user_group_creation_objectives: [],
    side_panel_open: false,
    restricted_element_ids: [ElementID.NewEntityBtn],
    layout_groups: COMMON_LAYOUT_GROUPS,
  },
  on: {
    ...SHARED_TOP_LEVEL_EVENTS,
  },
  states: {
    inside_level: {
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } },
        {
          type: 'apply_initial_node_connections',
          params: { initialConnections: INITIAL_IN_LEVEL_CONNECTIONS },
        },
        'disable_edges_management_ability',
        { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[0] } },
      ],
      initial: 'popup_1',
      states: {
        popup_1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: 'popup_2',
          },
        },
        popup_2: {
          entry: [{ type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } }],
          on: {
            NEXT_POPUP: 'popover_1',
          },
        },
        popover_1: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
            'hide_popups',
          ],
          on: {
            NEXT_POPOVER: 'fixed_popover_1',
          },
        },
        fixed_popover_1: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'popover_2',
          },
        },
        popover_2: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[1] } },
            {
              type: 'show_node_help_tooltip',
              params: {
                nodeId: PolicyNodeID.SlackSecretsAccessPolicy,
                content: 'Edit the policy by clicking the edit button in the node content',
              },
            },
          ],
          on: {
            [DataEvent.IAMNodeContentOpened]: {
              guard: ({ context, event }) => event.node_id === context.popover_content?.element_id,
              target: 'edit_policy',
            },
          },
        },
        edit_policy: {
          meta: { highlighted_elements: [ElementID.IAMNodeContentEditButton] },
          entry: [
            'hide_popovers',
            { type: 'append_edit_objectives', params: { objectives: POLICY_EDIT_OBJECTIVES[0] } },
          ],
          on: {
            [PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_FIRST_TIME]: {
              target: 'fixed_popover_2',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: {
                    id: LevelObjectiveID.EDIT_POLICY_FIRST_TIME,
                  },
                },
                {
                  type: 'edit_node_attributes',
                  params: {
                    nodeId: PolicyNodeID.SlackSecretsAccessPolicy,
                    attributes: { editable: false },
                  },
                },
                {
                  type: 'hide_node_help_tooltip',
                  params: {
                    nodeId: PolicyNodeID.SlackSecretsAccessPolicy,
                  },
                },
              ],
            },
          },
        },
        fixed_popover_2: {
          entry: [
            'hide_popovers',
            'store_checkpoint',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'popover_3',
          },
        },
        popover_3: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[2] } },
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
          ],
          on: {
            [VoidEvent.IAMNodeTagsOpened]: 'fixed_popover_3',
          },
        },
        fixed_popover_3: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[3] } },
          ],
          on: {
            [VoidEvent.IAMNodeTagsPopoverClosed]: 'popover_4',
          },
        },
        popover_4: {
          meta: { highlighted_elements: [ElementID.IAMNodeContentEditButton] },
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[3] } },
          ],
          on: {
            [DataEvent.IAMNodeContentOpened]: {
              guard: ({ context, event }) => event.node_id === context.popover_content?.element_id,
              target: 'edit_policy_again',
            },
          },
        },
        edit_policy_again: {
          entry: [
            'hide_popovers',
            {
              type: 'edit_node_attributes',
              params: {
                nodeId: PolicyNodeID.SlackSecretsAccessPolicy,
                attributes: { editable: true },
              },
            },
            {
              type: 'show_node_help_tooltip',
              params: {
                nodeId: PolicyNodeID.SlackSecretsAccessPolicy,
                content: 'Edit the policy again to use tags in the policy conditions',
              },
            },
            { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[1] } },
            {
              type: 'set_permission_policy_edit_objectives',
              params: { objectives: POLICY_EDIT_OBJECTIVES[1] },
            },
          ],
          on: {
            [PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_SECOND_TIME]: {
              target: 'popover_5',
              actions: [
                {
                  type: 'hide_node_help_tooltip',
                  params: {
                    nodeId: PolicyNodeID.SlackSecretsAccessPolicy,
                  },
                },
                {
                  type: 'finish_level_objective',
                  params: {
                    id: LevelObjectiveID.EDIT_POLICY_SECOND_TIME,
                  },
                },
              ],
            },
          },
        },
        popover_5: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[4] } },
          ],
          on: {
            NEXT_POPOVER: 'level_completed',
          },
        },
        level_completed: {
          entry: [
            'store_checkpoint',
            'hide_popovers',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[2] } },
          ],
          type: 'final',
        },
      },
    },
  },
});
