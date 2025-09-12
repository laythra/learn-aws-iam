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
import { ElementID } from '@/config/element-ids';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

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
    role_creation_objectives: [],
    use_multi_account_canvas: false,
    side_panel_open: false,
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    restricted_element_ids: [ElementID.NewEntityBtn],
    layout_groups: COMMON_LAYOUT_GROUPS,
  },
  on: {
    TOGGLE_SIDE_PANEL: { actions: 'toggle_side_panel' },
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ params: event.node_data, nodeType: event.node_entity }),
        },
      ],
    },
    [StatefulStateMachineEvent.ADDIAMRoleNode]: {
      actions: [
        {
          type: 'add_role_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            accountId: event.account_id,
            label: event.label,
          }),
        },
      ],
    },
    [StatefulStateMachineEvent.ConnectNodes]: {
      actions: [
        {
          type: 'connect_nodes',
          params: ({ event }) => ({ sourceNode: event.sourceNode, targetNode: event.targetNode }),
        },
      ],
    },
    [StatefulStateMachineEvent.DeleteEdge]: {
      actions: [
        {
          type: 'delete_edge',
          params: ({ event }) => ({ edge: event.edge }),
        },
      ],
    },
    [StatefulStateMachineEvent.DeleteNode]: {
      actions: [
        {
          type: 'delete_node',
          params: ({ event }) => ({ node: event.node }),
        },
      ],
    },
    [StatefulStateMachineEvent.EditIAMPolicyNode]: {
      actions: [
        {
          type: 'edit_policy_node',
          params: ({ event }) => ({ nodeId: event.node_id, docString: event.doc_string }),
        },
      ],
    },
    [StatelessStateMachineEvent.HidePopovers]: { actions: 'hide_popovers' },
    [StatelessStateMachineEvent.HideHelpPopover]: { actions: 'hide_help_popover' },
    [StatelessStateMachineEvent.ShowHelpPopover]: { actions: 'show_help_popover' },
  },
  states: {
    inside_level: {
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } },
        assign({
          initial_node_connections: INITIAL_IN_LEVEL_CONNECTIONS,
        }),
        'resolve_initial_edges', // TODO: Can't we pass the connections directly?
        'disable_edges_management_ability',
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[0] } },
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
            assign({
              policy_edit_objectives: POLICY_EDIT_OBJECTIVES[0], // TODO: Move into `objectives_map`
            }),
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
              ],
            },
          },
        },
        fixed_popover2: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'popover3',
          },
        },
        popover3: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeTagsOpened]: 'fixed_popover3',
          },
        },
        fixed_popover3: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[2] } },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeTagsPopoverClosed]: 'popover4',
          },
        },
        popover4: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[3] } },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: 'edit_policy_again',
          },
        },
        edit_policy_again: {
          entry: [
            'hide_popovers',
            {
              type: 'edit_policy_node_attributes',
              params: {
                nodeId: PolicyNodeID.SlackServiceManagePolicy,
                attributes: { editable: true },
              },
            },
            { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[1] } },
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
