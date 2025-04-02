import { and, assign, not } from 'xstate';

import { INITIAL_TUTORIAL_CONNECTIONS } from './initial-connections';
import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { ROLE_CREATION_OBJECTIVES } from './objectives/role-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  RoleCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { ElementID } from '@/config/element-ids';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  [],
  ROLE_CREATION_OBJECTIVES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level5_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'IAM Roles',
    level_description: `
      Understand IAM Roles and how to use them to enable
      secure service-to-service communication within your AWS environment.
    `,
    level_number: 5,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
    next_role_creation_objectives_index: 0,
    next_edges_connection_objectives_index: 0,
    state_name: 'inside_tutorial',
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
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    nodes_connnections: [],
  },
  on: {
    ADD_EDGE: {
      actions: assign({
        edges: ({ context, event }) => [...context.edges, event.edge],
      }),
    },
    SET_NODES: {
      actions: assign({
        nodes: ({ event }) => event.nodes,
      }),
    },
    SET_EDGES: {
      actions: [
        assign({
          edges: ({ event }) => event.edges,
        }),
      ],
    },
    SHOW_POPOVER: {
      actions: assign({
        popover_content: ({ event }) => event.popover_content,
        show_popovers: true,
      }),
    },
    HIDE_POPOVERS: {
      actions: assign({
        show_popovers: false,
      }),
    },
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
          params: ({ event }) => ({ docString: event.doc_string, label: event.label }),
        },
      ],
    },
    [StatefulStateMachineEvent.ConnectNodes]: {
      actions: [
        {
          type: 'connect_nodes',
          params: ({ event }) => ({
            sourceNode: event.sourceNode,
            targetNode: event.targetNode,
          }),
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
  },
  states: {
    inside_tutorial: {
      initial: 'tutorial_popup1',
      onDone: 'inside_level',
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_NODES } },
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[0] } },
        assign({
          initial_node_connections: INITIAL_TUTORIAL_CONNECTIONS,
        }),
        'resolve_initial_edges',
        'next_edge_connection_objectives',
        'enable_tutorial_state',
        'show_side_panel',
      ],
      states: {
        tutorial_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popup2',
          },
        },
        tutorial_popup2: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popup3',
          },
        },
        tutorial_popup3: {
          entry: 'next_popup',
          exit: 'hide_popups',
          on: {
            NEXT_POPUP: 'tutorial_popover1',
          },
        },
        tutorial_popover1: {
          entry: [
            'next_popover',
            {
              type: 'update_whitelisted_element_ids',
              params: { whitelisted_element_ids: [ElementID.IAMNodeContentButton] },
            },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: {
              actions: 'hide_popovers',
              target: 'fixed_popover1',
            },
          },
        },
        fixed_popover1: {
          entry: ['hide_popovers', 'show_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: 'next_fixed_popover',
          on: {
            [EdgeConnectionFinishEvent.TUTORIAL_ROLE1_ATTACHED_TO_USER]: {
              target: 'user_attached_to_tutorial_role_popover',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.ATTACH_USER_TO_TUTORIAL_ROLE },
                },
              ],
            },
          },
        },
        user_attached_to_tutorial_role_popover: {
          entry: ['hide_fixed_popovers', 'next_popover'],
          on: {
            NEXT_POPOVER: 'create_your_first_role_popover',
          },
        },
        create_your_first_role_popover: {
          entry: [
            'next_popover',
            'next_role_creation_objectives',
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [
                  ElementID.NewEntityBtn,
                  ElementID.CreateRolesAndPoliciesMenuItem,
                  ElementID.CodeEditorRoleTab,
                  ElementID.IAMNodeContentButton,
                ],
              },
            },
          ],
          on: {
            [RoleCreationFinishEvent.TUTORIAL_ROLE_CREATED]: {
              target: 'role_creation_finished_popover1',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.CREATE_TUTORIAL_ROLE },
                },
              ],
            },
          },
        },
        role_creation_finished_popover1: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'role_creation_finished_popover2',
          },
        },
        role_creation_finished_popover2: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'give_finance_user_s3_access',
          },
        },
        give_finance_user_s3_access: {
          type: 'parallel',
          entry: 'next_popover',
          onDone: {
            target: 'tutorial_finished_popover',
            actions: [
              {
                type: 'finish_level_objective',
                params: { id: LevelObjectiveID.GRANT_TUTORIAL_S3_READ_ACCESS },
              },
            ],
          },
          states: {
            attach_s3_policy_to_role2: {
              initial: 'attach_s3_policy_to_role2_in_progress',
              states: {
                attach_s3_policy_to_role2_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.TUTORIAL_POLICY_ATTACHED_TO_ROLE2]: 'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            attach_role2_to_finance_user: {
              initial: 'attach_role2_to_finance_user_in_progress',
              states: {
                attach_role2_to_finance_user_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.TUTORIAL_ROLE2_ATTACHED_TO_USER]: 'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
          },
        },
        tutorial_finished_popover: {
          entry: ['next_popover'],
          on: {
            NEXT_POPOVER: 'tutorial_finished_fixed_popover1',
          },
        },
        tutorial_finished_fixed_popover1: {
          entry: ['hide_popovers', 'next_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: [
              {
                guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
                target: 'remove_unnecessary_edges_and_nodes',
              },
              {
                guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
                target: 'tutorial_finished',
              },
            ],
          },
        },
        remove_unnecessary_edges_and_nodes: {
          entry: 'show_unncessary_edges_or_nodes_warning',
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          type: 'final',
        },
      },
    },
    inside_level: {
      entry: [
        assign({
          nodes: INITIAL_IN_LEVEL_NODES,
          edges: [],
          level_objectives: LEVEL_OBJECTIVES[1],
          in_tutorial_state: false,
        }),
        {
          type: 'update_red_dot_visibility',
          params: {
            elementIds: [ElementID.RightSidePanelToggleButton, ElementID.CodeEditorHelpButton],
            isVisible: true,
          },
        },
        'next_edge_connection_objectives',
        'next_role_creation_objectives',
        'hide_unncessary_edges_or_nodes_warning',
      ],
      initial: 'inside_level_popup1',
      states: {
        inside_level_popup1: {
          entry: ['hide_fixed_popovers', 'next_popup'],
          on: {
            NEXT_POPUP: 'inside_level_fixed_popover1',
          },
        },
        inside_level_fixed_popover1: {
          entry: ['hide_popups', 'next_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: 'create_role_and_policy',
          },
        },
        create_role_and_policy: {
          entry: 'hide_fixed_popovers',
          onDone: 'level_finished_fixed_popover',
          type: 'parallel',
          states: {
            create_lambda_role: {
              initial: 'create_lambda_role_in_progress',
              onDone: {
                actions: {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.GRANT_LAMBDA_S3_READ_ACCESS },
                },
              },
              states: {
                create_lambda_role_in_progress: {
                  on: {
                    [RoleCreationFinishEvent.LAMBDA_ROLE_CREATED]: 'attach_lambda_nodes',
                  },
                },
                attach_lambda_nodes: {
                  type: 'parallel',
                  onDone: 'completed',
                  states: {
                    attach_s3_read_policy_to_lambda_role: {
                      initial: 'attach_s3_read_policy_to_lambda_role_in_progress',
                      states: {
                        attach_s3_read_policy_to_lambda_role_in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.S3_READ_POLICY_ATTACHED_TO_LAMBDA_ROLE]:
                              'completed',
                          },
                        },
                        completed: {
                          type: 'final',
                        },
                      },
                    },
                    attach_lambda_role_to_lambda_function: {
                      initial: 'attach_lambda_role_to_lambda_function_in_progress',
                      states: {
                        attach_lambda_role_to_lambda_function_in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.LAMBDA_ROLE_ATTACHED_TO_LAMBDA_FUNCTION]:
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
                completed: {
                  type: 'final',
                },
              },
            },
            create_ec2_role: {
              initial: 'create_ec2_role_in_progress',
              onDone: {
                actions: {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.GRANT_EC2_S3_WRITE_ACCESS },
                },
              },
              states: {
                create_ec2_role_in_progress: {
                  on: {
                    [RoleCreationFinishEvent.EC2_ROLE_CREATED]: 'attach_ec2_nodes',
                  },
                },
                attach_ec2_nodes: {
                  type: 'parallel',
                  onDone: 'completed',
                  states: {
                    attach_s3_write_policy_to_ec2_role: {
                      initial: 'attach_s3_write_policy_to_ec2_role_in_progress',
                      states: {
                        attach_s3_write_policy_to_ec2_role_in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.S3_WRITE_POLICY_ATTACHED_TO_EC2_ROLE]:
                              'completed',
                          },
                        },
                        completed: {
                          type: 'final',
                        },
                      },
                    },
                    attach_ec2_role_to_ec2_instance: {
                      initial: 'attach_ec2_role_to_ec2_instance_in_progress',
                      states: {
                        attach_ec2_role_to_ec2_instance_in_progress: {
                          on: {
                            [EdgeConnectionFinishEvent.EC2_ROLE_ATTACHED_TO_EC2_INSTANCE]:
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
                completed: {
                  type: 'final',
                },
              },
            },
          },
        },
        level_finished_fixed_popover: {
          entry: 'next_fixed_popover',
          on: {
            NEXT_FIXED_POPOVER: [
              {
                guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
                target: 'remove_unnecessary_edges_and_nodes',
              },
              {
                guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
                target: 'level_finished_popup',
              },
            ],
          },
        },
        remove_unnecessary_edges_and_nodes: {
          entry: 'show_unncessary_edges_or_nodes_warning',
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_finished_popup',
          },
        },
        level_finished_popup: {
          entry: ['hide_popovers', 'next_popup'],
        },
      },
    },
  },
});
