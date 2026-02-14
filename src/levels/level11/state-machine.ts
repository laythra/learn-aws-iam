import { INITIAL_TUTORIAL_CONNECTIONS } from './initial-connections';
import { LAYOUT_GROUPS } from './layout-groups';
import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { PERMISSION_BOUNDARY_CREATION_OBJECTIVES } from './objectives/permission-boundary-creation-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  PermissionBoundaryCreationFinishEvent,
  PolicyCreationFinishEvent,
} from './types/finish-event-enums';
import { PolicyNodeID, RoleNodeID, UserNodeID } from './types/node-id-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { ElementID } from '@/config/element-ids';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level11_state_machine',
  initial: 'inside_tutorial',
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
    side_panel_open: false,
    layout_groups: [...COMMON_LAYOUT_GROUPS, ...LAYOUT_GROUPS],
    restricted_element_ids: [
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorSCPTab,
      ElementID.CodeEditorResourcePolicyTab,
      ElementID.CreateUserGroupMenuItem,
    ],
  },
  on: {
    ...SHARED_TOP_LEVEL_EVENTS,
  },
  states: {
    inside_tutorial: {
      entry: [
        {
          type: 'assign_nodes',
          params: { nodes: INITIAL_TUTORIAL_NODES },
        },
        { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[0] } },
        {
          type: 'apply_initial_node_connections',
          params: { initialConnections: INITIAL_TUTORIAL_CONNECTIONS },
        },
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
            'disable_edges_management_ability',
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
      entry: [
        'clear_creation_objectives',
        'store_checkpoint',
        'hide_popovers',
        { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } },
        { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[1] } },
      ],
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
            NEXT_POPUP: 'popover4',
          },
        },
        popover4: {
          entry: [
            'hide_popups',
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[3] },
            },
          ],
          on: {
            NEXT_POPOVER: 'popover5',
          },
        },
        popover5: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[4] },
            },
          ],
          on: {
            NEXT_POPOVER: 'popover6',
          },
        },
        popover6: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[5] },
            },
          ],
          on: {
            NEXT_POPOVER: 'create_permission_boundary',
          },
        },
        create_permission_boundary: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[6] },
            },
            {
              type: 'update_restricted_element_ids',
              params: ({ context }) => ({
                restricted_element_ids: [
                  ...(context.restricted_element_ids ?? []),
                  ElementID.CodeEditorPolicyTab,
                ],
              }),
            },
            {
              type: 'append_creation_objectives',
              params: { objectives: PERMISSION_BOUNDARY_CREATION_OBJECTIVES[0] },
            },
          ],
          on: {
            [PermissionBoundaryCreationFinishEvent.READ_SECRETS_PERMISSION_BOUNDARY_CREATED]:
              'permission_boundary_created',
          },
        },
        permission_boundary_created: {
          entry: [
            'store_checkpoint',
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[7] },
            },
          ],
          on: {
            NEXT_POPOVER: 'create_delegation_policy',
          },
        },
        create_delegation_policy: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[8] },
            },
            {
              type: 'finish_level_objective',
              params: { id: LevelObjectiveID.CREATE_PERMISSIONS_DELEGATION_POLICY },
            },
            {
              type: 'append_creation_objectives',
              params: { objectives: POLICY_CREATION_OBJECTIVES[0] },
            },
            {
              type: 'update_restricted_element_ids',
              // TODO: move bulky logic to the action itself
              params: ({ context }) => ({
                restricted_element_ids: (context.restricted_element_ids ?? [])
                  .filter(id => id !== ElementID.CodeEditorPolicyTab)
                  .concat([ElementID.CodeEditorPermissionBoundaryTab]),
              }),
            },
          ],
          on: {
            [PolicyCreationFinishEvent.ACCESS_DELEGATION_POLICY_CREATED]: 'attach_nodes',
          },
        },
        attach_nodes: {
          onDone: 'attach_nodes_finished',
          entry: [
            'store_checkpoint',
            'enable_edges_management_ability',

            {
              type: 'show_fixed_popover_message',
              params: { message: FIXED_POPOVER_MESSAGES[1] },
            },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[1] },
            },
          ],
          type: 'parallel',
          states: {
            attach_permission_boundary: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.PERMISSION_BOUNDARY_CONNECTED_TO_ROLE]: 'finished',
                  },
                },
                finished: {
                  type: 'final',
                },
              },
            },
            attach_permission_policy: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.ACCESS_DELEGATION_POLICY_CONNECTED_TO_CLOUD]:
                      'finished',
                  },
                },
                finished: {
                  type: 'final',
                },
              },
            },
          },
        },
        attach_nodes_finished: {
          entry: [
            'store_checkpoint',
            {
              type: 'show_fixed_popover_message',
              params: { message: FIXED_POPOVER_MESSAGES[2] },
            },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover3',
          },
        },
        fixed_popover3: {
          entry: [
            'hide_fixed_popovers',
            'disable_edges_management_ability',
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[9] },
            },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[2] },
            },
          ],
          on: {
            NEXT_POPOVER: 'admin_policy_attached_to_role',
          },
          exit: {
            type: 'connect_nodes',
            params: ({ context }) => ({
              sourceNode: context.nodes.find(n => n.id === PolicyNodeID.FullAccessPolicy)!,
              targetNode: context.nodes.find(n => n.id === RoleNodeID.Role1)!,
            }),
          },
        },
        admin_policy_attached_to_role: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[10] },
            },
          ],
          on: {
            NEXT_POPOVER: 'attach_tifa_user_to_role',
          },
        },
        attach_tifa_user_to_role: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[11] },
            },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[3] },
            },
          ],
          on: {
            NEXT_POPOVER: 'tifa_user_attached_to_role',
          },
          exit: {
            type: 'connect_nodes',
            params: ({ context }) => ({
              sourceNode: context.nodes.find(n => n.id === UserNodeID.Tifa)!,
              targetNode: context.nodes.find(n => n.id === RoleNodeID.Role1)!,
            }),
          },
        },
        tifa_user_attached_to_role: {
          entry: [
            'hide_popovers',
            {
              type: 'show_fixed_popover_message',
              params: { message: FIXED_POPOVER_MESSAGES[3] },
            },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'level_completed',
          },
        },
        level_completed: {
          type: 'final',
          entry: [
            'hide_fixed_popovers',
            {
              type: 'show_popup_message',
              params: { message: POPUP_TUTORIAL_MESSAGES[4] },
            },
          ],
        },
      },
    },
  },
});
