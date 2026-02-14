import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_CONNECTIONS } from './initial-connections';
import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_EDIT_OBJECTIVES } from './objectives/policy-edit-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap, PolicyEditFinishEvent } from './types/finish-event-enums';
import { PolicyNodeID } from './types/node-id-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { ElementID } from '@/config/element-ids';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level8_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'Service Control Policies',
    level_description: 'Service Control Policies',
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
      initial: 'popup1',
      states: {
        popup1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: 'popup2',
          },
        },
        popup2: {
          entry: [{ type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } }],
          on: {
            NEXT_POPUP: 'popover1',
          },
        },
        popover1: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
            'hide_popups',
          ],
          on: {
            NEXT_POPOVER: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'popover2',
          },
        },
        popover2: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[1] } },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: 'edit_policy',
          },
        },
        edit_policy: {
          entry: [
            'hide_popovers',
            { type: 'append_edit_objectives', params: { objectives: POLICY_EDIT_OBJECTIVES[0] } },
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [ElementID.IAMNodeContentEditButton],
                isVisible: true,
              },
            },
          ],
          on: {
            [PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_FIRST_TIME]: {
              target: 'fixed_popover2',
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
                    nodeId: PolicyNodeID.SlackServiceManagePolicy,
                    attributes: { editable: false },
                  },
                },
              ],
            },
          },
        },
        fixed_popover2: {
          entry: [
            'hide_popovers',
            'store_checkpoint',
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [ElementID.IAMNodeContentEditButton],
                isVisible: false,
              },
            },
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'popover3',
          },
        },
        popover3: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[2] } },
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeTagsOpened]: 'fixed_popover3',
          },
        },
        fixed_popover3: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[3] } },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeTagsPopoverClosed]: 'popover4',
          },
        },
        popover4: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[3] } },
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [ElementID.IAMNodeContentEditButton],
                isVisible: true,
              },
            },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: 'edit_policy_again',
          },
        },
        edit_policy_again: {
          entry: [
            'hide_popovers',
            {
              type: 'edit_node_attributes',
              params: {
                nodeId: PolicyNodeID.SlackServiceManagePolicy,
                attributes: { editable: true },
              },
            },
            { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[1] } },
            assign({
              policy_edit_objectives: POLICY_EDIT_OBJECTIVES[1], // TODO: Move into `objectives_map`
            }),
          ],
          on: {
            [PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_SECOND_TIME]: {
              target: 'popover5',
              actions: [
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
        popover5: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[4] } },
          ],
          on: {
            NEXT_POPOVER: 'popup3',
          },
        },
        popup3: {
          entry: [
            'hide_popovers',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[2] } },
          ],
          type: 'final',
        },
      },
    },
  },
});
