import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_CONNECTIONS, INITIAL_TUTORIAL_CONNECTIONS } from './initial-connections';
import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { SCP_CREATION_OBJECTIVES } from './objectives/scp-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  SCPCreationFInishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { DEFAULT_ROLE_POLICY_OBJECTIVES_MAP } from '../config';
import { ElementID } from '@/config/element-ids';
import { IAMNodeEntity } from '@/types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level8_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'Service Control Policies',
    level_description: 'Service Control Policies',
    level_number: 8,
    next_popover_index: 6,
    next_popup_index: 2,
    next_fixed_popover_index: 1,
    // next_popover_index: 0,
    // next_popup_index: 0,
    // next_fixed_popover_index: 0,
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
    nodes_connnections: [],
    all_policy_creation_objectives: [],
    objectives_map: {
      ...DEFAULT_ROLE_POLICY_OBJECTIVES_MAP,
      [IAMNodeEntity.SCP]: { objectives: SCP_CREATION_OBJECTIVES, current_index: 0 },
    },
    // help_tips: ['ConnectNodes', 'CreatePolicies'],
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
    [StatelessStateMachineEvent.HidePopovers]: { actions: 'hide_popovers' },
    [StatelessStateMachineEvent.HideHelpPopover]: { actions: 'hide_help_popover' },
    [StatelessStateMachineEvent.ShowHelpPopover]: { actions: 'show_help_popover' },
  },
  states: {
    inside_tutorial: {
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_NODES } },
        'disable_edges_management_ability',
        assign({
          initial_node_connections: INITIAL_TUTORIAL_CONNECTIONS,
        }),
        'resolve_initial_edges',
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[0] } },
      ],
      onDone: 'inside_level',
      initial: 'welcoming_message',
      states: {
        welcoming_message: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popup1',
          },
        },
        tutorial_popup1: {
          entry: ['next_popup'],
          on: {
            NEXT_POPUP: 'tutorial_popover1',
          },
        },
        tutorial_popover1: {
          entry: ['next_popover', 'hide_popups'],
          on: {
            NEXT_POPOVER: 'tutorial_popover2',
          },
        },
        tutorial_popover2: {
          entry: ['next_popover'],
          on: {
            NEXT_POPOVER: 'tutorial_popover3',
          },
        },
        tutorial_popover3: {
          entry: 'next_popover',
          // type: 'final',
          on: {
            NEXT_POPOVER: 'tutorial_popover4',
          },
        },
        tutorial_popover4: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_fixed_popover1',
          },
        },
        tutorial_fixed_popover1: {
          entry: ['hide_popovers', 'show_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: 'create_tutorial_scp',
          },
        },
        create_tutorial_scp: {
          entry: [
            'hide_fixed_popovers',
            'next_popover',
            {
              type: 'next_policy_role_creation_objectives',
              params: { entity: IAMNodeEntity.SCP },
            },
            {
              type: 'update_restricted_element_ids',
              params: {
                restricted_element_ids: [
                  ElementID.CodeEditorPolicyTab,
                  ElementID.CodeEditorRoleTab,
                ],
              },
            },
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [ElementID.NewEntityBtn, ElementID.CreateRolesAndPoliciesMenuItem],
                isVisible: true,
              },
            },
          ],
          on: {
            [SCPCreationFInishEvent.TUTORIAL_SCP_CREATED]: 'scp_policy_created',
          },
        },
        scp_policy_created: {
          entry: [
            'next_popover',
            'next_edge_connection_objectives',
            'enable_edges_management_ability',
          ],
          on: {
            [EdgeConnectionFinishEvent.TUTORIAL_SCP_ATTACHED_TO_OU]: {
              target: 'scp_attached_to_ou',
              actions: [
                {
                  type: 'change_objective_progress',
                  params: {
                    id: LevelObjectiveID.CREATE_TUTORIAL_SCP,
                    finished: true,
                  },
                },
              ],
            },
          },
        },
        scp_attached_to_ou: {
          entry: ['next_popover'],
          on: {
            NEXT_POPOVER: {
              target: 'tutorial_finished',
              actions: [
                {
                  type: 'change_objective_progress',
                  params: {
                    id: LevelObjectiveID.ATTACH_TUTORIAL_SCP_TO_OU,
                    finished: true,
                  },
                },
              ],
            },
          },
        },
        tutorial_finished: {
          type: 'final',
        },
      },
    },
    inside_level: {
      initial: 'in_level_popup1',
      entry: [
        {
          type: 'assign_nodes',
          params: { nodes: INITIAL_IN_LEVEL_NODES },
        },
        assign({
          initial_node_connections: INITIAL_IN_LEVEL_CONNECTIONS,
        }),
        'resolve_initial_edges',
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[1] } },
        'next_edge_connection_objectives',
      ],
      states: {
        in_level_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'in_level_fixed_popover1',
          },
        },
        in_level_fixed_popover1: {
          entry: ['hide_popovers', 'hide_popups', 'show_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: 'create_in_level_scp',
          },
        },
        create_in_level_scp: {
          entry: 'hide_fixed_popovers',
          on: {
            [SCPCreationFInishEvent.IN_LEVEL_SCP_CREATED]: 'scp_in_level_created',
          },
        },
        scp_in_level_created: {
          entry: ['next_edge_connection_objectives', 'enable_edges_management_ability'],
          on: {
            [EdgeConnectionFinishEvent.IN_LEVEL_SCP_ATTACHED_TO_OU]: {
              target: 'scp_in_level_attached_to_ou_popover1',
              actions: [
                {
                  type: 'change_objective_progress',
                  params: {
                    id: LevelObjectiveID.CREATE_IN_LEVEL_SCP,
                    finished: true,
                  },
                },
              ],
            },
          },
        },
        scp_in_level_attached_to_ou_popover1: {
          entry: ['next_popover'],
          on: {
            NEXT_POPOVER: {
              target: 'scp_in_level_attached_to_ou_popover2',
            },
          },
        },
        scp_in_level_attached_to_ou_popover2: {
          entry: ['next_popover'],
          on: {
            NEXT_POPOVER: {
              target: 'in_level_finished',
            },
          },
        },
        in_level_finished: {
          type: 'final',
          entry: 'next_popup',
        },
      },
    },
  },
});
