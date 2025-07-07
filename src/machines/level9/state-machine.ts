import { and, assign, not } from 'xstate';

import { INITIAL_IN_LEVEL_CONNECTIONS } from './initial-connections';
import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  PolicyCreationFinishEvent,
} from './types/finish-event-enums';
import { PolicyNodeID } from './types/node-id-enums';
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
  id: 'level9_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'TBAC: Resource Tags',
    level_description: 'TBAC: Resource Tags',
    level_number: 9,
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
    layout_groups: COMMON_LAYOUT_GROUPS,
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
            NEXT_POPUP: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popups',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'create_policy',
          },
        },
        create_policy: {
          type: 'parallel',
          onDone: 'fixed_popover3',
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
            },
            'enable_edges_management_ability',
            {
              type: 'set_permission_policy_creation_objectives',
              params: {
                objectives: POLICY_CREATION_OBJECTIVES[0],
              },
            },
          ],
          states: {
            create_policy1: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.RDS1_MANAGE_POLICY_CREATED]: 'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            create_policy2: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.RDS2_MANAGE_POLICY_CREATED]: 'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            attach_policy1_to_group1: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.RDS1_MANAGE_POLICY_ATTACHED_GROUP1]: 'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            attach_policy2_to_group2: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.RDS2_MANAGE_POLICY_ATTACHED_GROUP2]: 'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
          },
        },
        fixed_popover3: {
          entry: [
            'store_checkpoint',
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[2] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover4',
          },
        },
        fixed_popover4: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[3] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'create_new_policy',
          },
        },
        create_new_policy: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[1] } },
            {
              type: 'delete_nodes',
              params: { nodeIds: [PolicyNodeID.RDSManagePolicy1, PolicyNodeID.RDSManagePolicy2] },
            },
            {
              type: 'set_permission_policy_creation_objectives',
              params: {
                objectives: POLICY_CREATION_OBJECTIVES[1],
              },
            },
          ],
          on: {
            [PolicyCreationFinishEvent.RDS_SHARED_POLICY_CREATED]: 'attach_policy1_to_groups',
          },
        },
        attach_policy1_to_groups: {
          type: 'parallel',
          onDone: 'policy_creation_completed',
          entry: {
            type: 'set_edge_connection_objectives',
            params: { objectives: EDGE_CONNECTION_OBJECTIVES[1] },
          },
          states: {
            attach_policy_to_group1: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.RDS_SHARED_MANAGE_POLICY_ATTACHED_GROUP1]:
                      'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            attach_policy_to_group2: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.RDS_SHARED_MANAGE_POLICY_ATTACHED_GROUP2]:
                      'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
          },
        },
        policy_creation_completed: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[4] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: [
              {
                guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
                target: 'level_completed',
              },
              {
                guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
                target: 'remove_unnecessary_edges_and_nodes',
              },
            ],
          },
        },
        remove_unnecessary_edges_and_nodes: {
          entry: ['show_unncessary_edges_or_nodes_warning', 'hide_fixed_popovers'],
          exit: 'hide_unncessary_edges_or_nodes_warning',
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_completed',
          },
        },
        level_completed: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
          ],
          type: 'final',
        },
      },
    },
  },
});
