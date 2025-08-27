import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_CONNECTIONS } from './initial-connections';
import { LAYOUT_GROUPS } from './layout-groups';
import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { EdgeConnectionFinishEvent, FinishEventMap } from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { ElementID } from '@/config/element-ids';
import { IAMNodeEntity } from '@/types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level11_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'Permission Boundaries',
    level_description:
      'Permission Boundaries allow you to control the maximum permissions a user / role can have.',
    level_number: 11,
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
    nodes_connnections: [],
    layout_groups: [...COMMON_LAYOUT_GROUPS, ...LAYOUT_GROUPS],
    restricted_element_ids: [
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorSCPTab,
      ElementID.CodeEditorResourcePolicyTab,
    ],
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
    [StatefulStateMachineEvent.AddIAMSCPNode]: {
      actions: [
        {
          type: 'add_scp_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            label: event.label,
          }),
        },
      ],
    },
    [StatefulStateMachineEvent.AddIAMPolicyNode]: {
      actions: {
        type: 'add_policy_node',
        params: ({ event }) => ({
          docString: event.doc_string,
          label: event.label,
          policyNodeType: IAMNodeEntity.Policy,
        }),
      },
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
    inside_tutorial: {
      entry: [
        {
          type: 'assign_nodes',
          params: { nodes: INITIAL_TUTORIAL_NODES },
        },
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[0] } },
        assign({
          initial_node_connections: INITIAL_IN_LEVEL_CONNECTIONS,
        }),
        'resolve_initial_edges', // TODO: Can't we pass the connections directly?
        'disable_edges_management_ability',
      ],
      initial: 'popup1',
      onDone: 'inside_level',
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
            'hide_popups',
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[0] },
            },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popovers',
            {
              type: 'show_fixed_popover_message',
              params: { message: FIXED_POPOVER_MESSAGES[0] },
            },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentClosed]: 'popover2',
          },
        },
        popover2: {
          entry: [
            'hide_fixed_popovers',
            'enable_edges_management_ability',
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
            },
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[1] },
            },
          ],
          on: {
            [EdgeConnectionFinishEvent.TUTORIAL_POLICY1_ATTACHED_TO_USER]: 'popover3',
          },
        },
        popover3: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[2] },
            },
          ],
          on: {
            NEXT_POPOVER: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          type: 'final',
        },
      },
    },
    inside_level: {
      entry: ['hide_popovers', { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } }],
      initial: 'popup3',
      states: {
        popup3: {
          entry: [
            {
              type: 'show_popup_message',
              params: { message: POPUP_TUTORIAL_MESSAGES[2] },
            },
          ],
          on: {
            NEXT_POPUP: 'popup4',
          },
        },
        popup4: {
          entry: [
            {
              type: 'show_popup_message',
              params: { message: POPUP_TUTORIAL_MESSAGES[3] },
            },
          ],
          on: {
            NEXT_POPUP: 'start_level',
          },
        },

        start_level: {},
      },
    },
  },
});
