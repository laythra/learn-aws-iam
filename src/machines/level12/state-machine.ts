import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_CONNECTIONS, INITIAL_TUTORIAL_CONNECTIONS } from './initial-connections';
import { LAYOUT_GROUPS } from './layout-groups';
import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { PERMISSION_BOUNDARY_CREATION_OBJECTIVES } from './objectives/permission-boundary-creation-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
import { SCP_CREATION_OBJECTIVES } from './objectives/scp-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  PermissionBoundaryCreationFinishEvent,
  PolicyCreationFinishEvent,
  RoleCreationFinishEvent,
  SCPCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { ROLE_CREATION_OBJECTIVES } from '../level12/objectives/role-creation-objectives';
import { ElementID } from '@/config/element-ids';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level12_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'Final Level',
    level_description: 'Final Level',
    level_number: 12,
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: [],
    policy_creation_objectives: [],
    policy_edit_objectives: [],
    user_group_creation_objectives: [],
    edges_connection_objectives: [],
    side_panel_open: false,
    layout_groups: [...COMMON_LAYOUT_GROUPS, ...LAYOUT_GROUPS],
    restricted_element_ids: [
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorResourcePolicyTab,
      ElementID.CreateEntitiesMenuItem,
      ElementID.CodeEditorPolicyTab,
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorResourcePolicyTab,
      ElementID.CodeEditorPermissionBoundaryTab,
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
    [StatefulStateMachineEvent.AddIAMNode]: {
      actions: {
        type: 'add_iam_node',
        params: ({ event }) => ({
          docString: event.doc_string,
          label: event.label,
          accountId: event.account_id,
          policyNodeType: event.node_entity,
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
    [StatelessStateMachineEvent.AggregateUserNodes]: {
      actions: [
        {
          type: 'aggregate_user_nodes',
        },
      ],
    },
    [StatefulStateMachineEvent.DeaggregateUserNodes]: {
      actions: [
        {
          type: 'deaggregate_user_nodes',
          params: ({ event }) => ({ nodeId: event.nodeId }),
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
        assign({
          initial_node_connections: INITIAL_TUTORIAL_CONNECTIONS,
        }),
        'resolve_initial_edges', // TODO: Can't we pass the connections directly?
      ],
      initial: 'popup1',
      onDone: 'inside_level',
      states: {
        popup1: {
          entry: [{ type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } }],
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
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
          ],
          on: {
            NEXT_POPOVER: 'popover2',
          },
        },
        popover2: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[1] } },
          ],
          on: {
            NEXT_POPOVER: 'popover3',
          },
        },
        popover3: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
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
            [StatelessStateMachineEvent.IAMNodeContentClosed]: 'create_scp',
          },
        },
        create_scp: {
          entry: [
            'hide_fixed_popovers',
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[3] },
            },
            {
              type: 'append_creation_objectives',
              params: {
                objectives: SCP_CREATION_OBJECTIVES[0],
              },
            },
          ],
          on: {
            [SCPCreationFinishEvent.BLOCK_CLOUDTRAIL_DELETION_SCP_CREATED]: 'connect_scp_to_ou',
          },
        },
        connect_scp_to_ou: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[4] } },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
            },
          ],
          on: {
            [EdgeConnectionFinishEvent.COULDTRAIL_SCP_CONNECTED]: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'tutorial_complete',
          },
        },
        tutorial_complete: {
          entry: 'hide_fixed_popovers',
          type: 'final',
        },
      },
    },
    inside_level: {
      entry: [
        // 'store_checkpoint',
        {
          type: 'set_restricted_element_ids',
          params: {
            element_ids: [ElementID.CodeEditorResourcePolicyTab],
          },
        },
        { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } },
        { type: 'set_level_objectives', params: { objectives: LEVEL_OBJECTIVES[1] } },
        {
          type: 'set_creation_objectives',
          params: {
            objectives: [
              ...SCP_CREATION_OBJECTIVES[1],
              ...POLICY_CREATION_OBJECTIVES[0],
              ...ROLE_CREATION_OBJECTIVES[0],
              ...PERMISSION_BOUNDARY_CREATION_OBJECTIVES[0],
            ],
          },
        },
        {
          type: 'set_edge_connection_objectives',
          params: { objectives: EDGE_CONNECTION_OBJECTIVES[1] },
        },
        assign({
          initial_node_connections: INITIAL_IN_LEVEL_CONNECTIONS,
        }),
        'resolve_initial_edges', // TODO: Can't we pass the connections directly?
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
            NEXT_POPUP: 'in_progress',
          },
        },
        in_progress: {
          onDone: 'completed',
          type: 'parallel',
          entry: [
            'hide_popups',
            'show_side_panel',
            {
              type: 'update_red_dot_visibility',
              params: { elementIds: [ElementID.RightSidePanelToggleButton], isVisible: true },
            },
          ],
          states: {
            objective1: {
              initial: 'create_scp',
              onDone: {
                actions: [
                  {
                    type: 'finish_level_objective',
                    params: { id: LevelObjectiveID.RESTRICT_EC2_REGION },
                  },
                ],
              },
              states: {
                create_scp: {
                  on: {
                    [SCPCreationFinishEvent.RESTRICT_EC2_REGION_SCP_CREATED]: 'attach_scp',
                  },
                },
                attach_scp: {
                  on: {
                    [EdgeConnectionFinishEvent.EC2_REGION_SCP_CONNECTED]: 'finished',
                  },
                },
                finished: {
                  entry: {
                    type: 'finish_level_objective',
                    params: { id: LevelObjectiveID.RESTRICT_EC2_REGION },
                  },
                  type: 'final',
                },
              },
            },
            objective2: {
              initial: 'create_permission_boundary',
              onDone: {
                actions: [
                  {
                    type: 'show_popover_message',
                    params: { message: POPOVER_TUTORIAL_MESSAGES[6] },
                  },
                  {
                    type: 'finish_level_objective',
                    params: { id: LevelObjectiveID.DELEGATE_EC2_LAUNCHING },
                  },
                ],
              },
              states: {
                create_permission_boundary: {
                  on: {
                    [PermissionBoundaryCreationFinishEvent.ROLE_DELEGATION_PB_CREATED]:
                      'create_policy_and_attach_pb',
                  },
                },
                create_policy_and_attach_pb: {
                  type: 'parallel',
                  onDone: 'finished',
                  entry: [
                    {
                      type: 'append_creation_objectives',
                      params: {
                        objectives: POLICY_CREATION_OBJECTIVES[1],
                      },
                    },
                    {
                      type: 'show_popover_message',
                      params: { message: POPOVER_TUTORIAL_MESSAGES[5] },
                    },
                  ],
                  states: {
                    create_policy: {
                      initial: 'in_progress',
                      states: {
                        in_progress: {
                          on: {
                            [PolicyCreationFinishEvent.ACCESS_DELEGATION_POLICY_CREATED]:
                              'finished',
                          },
                        },
                        finished: {
                          type: 'final',
                        },
                      },
                    },
                    attach_permission_boundary_to_role: {
                      initial: 'in_progress',
                      states: {
                        in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.EC2_LAUNCH_PB_ATTACHED_TO_ROLE]: 'finished',
                          },
                        },
                        finished: {
                          type: 'final',
                        },
                      },
                    },
                    attach_policy_to_user: {
                      initial: 'in_progress',
                      states: {
                        in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.ACCESS_DELEGATION_POLICY_ATTACHED_TO_USER]:
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
                finished: {
                  type: 'final',
                },
              },
            },
            objective3: {
              type: 'parallel',
              onDone: {
                actions: [
                  {
                    type: 'finish_level_objective',
                    params: { id: LevelObjectiveID.ENABLE_EC2_TO_S3_COMMUNICATION },
                  },
                ],
              },
              states: {
                establish_trust_policy: {
                  initial: 'create_trust_policy',
                  states: {
                    create_trust_policy: {
                      on: {
                        [RoleCreationFinishEvent.EC2_ROLE_CREATED]: 'attach_trust_policy_to_ec2',
                      },
                    },
                    attach_trust_policy_to_ec2: {
                      on: {
                        [EdgeConnectionFinishEvent.TRUST_POLICY_ATTACHED_TO_EC2_INSTANCE]:
                          'finished',
                      },
                    },
                    finished: {
                      type: 'final',
                    },
                  },
                },
                estabish_permission_policy: {
                  initial: 'create_permission_policy',
                  states: {
                    create_permission_policy: {
                      on: {
                        [PolicyCreationFinishEvent.S3_WRITE_POLICY_CREATED]:
                          'attach_permission_policy',
                      },
                    },
                    attach_permission_policy: {
                      on: {
                        [EdgeConnectionFinishEvent.S3_WRITE_POLICY_ATTACHED_TO_ROLE]: 'finished',
                      },
                    },
                    finished: {
                      type: 'final',
                    },
                  },
                },
              },
            },
            objective4: {
              initial: 'create_elasticache_manage_policy',
              onDone: {
                actions: [
                  {
                    type: 'finish_level_objective',
                    params: { id: LevelObjectiveID.ELASTICACHE_ACCESS_MANAGEMENT },
                  },
                ],
              },
              states: {
                create_elasticache_manage_policy: {
                  on: {
                    [PolicyCreationFinishEvent.ELASTICACHE_MANAGEMENT_POLICY_CREATED]:
                      'attach_elasticache_manage_policy_to_group',
                  },
                },
                attach_elasticache_manage_policy_to_group: {
                  onDone: 'finished',
                  type: 'parallel',
                  states: {
                    attach_to_group1: {
                      initial: 'in_progress',
                      states: {
                        in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.EC_MANAGEMENT_POLICY_ATTACHED_TO_GROUP1]:
                              'finished',
                          },
                        },
                        finished: {
                          type: 'final',
                        },
                      },
                    },
                    attach_to_group2: {
                      initial: 'in_progress',
                      states: {
                        in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.EC_MANAGEMENT_POLICY_ATTACHED_TO_GROUP2]:
                              'finished',
                          },
                        },
                        finished: {
                          type: 'final',
                        },
                      },
                    },
                    attach_to_group3: {
                      initial: 'in_progress',
                      states: {
                        in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.EC_MANAGEMENT_POLICY_ATTACHED_TO_GROUP3]:
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
                finished: {
                  type: 'final',
                },
              },
            },
          },
        },
        completed: {
          initial: 'popup3',
          states: {
            popup3: {
              entry: [
                {
                  type: 'show_popup_message',
                  params: { message: POPUP_TUTORIAL_MESSAGES[3] },
                },
              ],
            },
          },
        },
      },
    },
  },
});
