import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { ROLE_CREATION_OBJECTIVES } from './objectives/role-creation-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  RoleCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { resolveInitialEdges } from '../utils/initial-edges-resolver';
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
    level_description: 'IAM Roles',
    level_number: 5,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
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
    fixed_popover_messages: [],
  },
  on: {
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
    [StatefulStateMachineEvent.AttachRoleToEntity]: {
      actions: [
        {
          type: 'attach_role_to_entity',
          params: ({ event }) => ({
            roleNode: event.sourceNode,
            targetNode: event.targetNode,
          }),
        },
      ],
    },

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
    TOGGLE_SIDE_PANEL: {
      actions: assign({
        side_panel_open: ({ context }) => !context.side_panel_open,
      }),
    },
    ATTACH_POLICY_TO_ENTITY: {
      actions: [
        {
          type: 'attach_policy_to_entity',
          params: ({ event }) => ({ policyNode: event.sourceNode, entityNode: event.targetNode }),
        },
      ],
    },
  },
  states: {
    inside_tutorial: {
      initial: 'tutorial_popup1',
      onDone: 'inside_level',
      entry: [
        assign({
          nodes: INITIAL_TUTORIAL_NODES,
          edges: resolveInitialEdges(INITIAL_TUTORIAL_NODES),
        }),
        'next_edge_connection_objectives',
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
          entry: 'next_popover',
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: {
              actions: 'hide_popovers',
              target: 'attach_role1_to_user_popover_loading',
            },
          },
        },
        attach_role1_to_user_popover_loading: {
          // Giving some time for the user to digest the opened trust policy content
          // TODO: Find a better way to handle this
          after: {
            3000: 'attach_role1_to_user_popover',
          },
        },
        attach_role1_to_user_popover: {
          entry: 'next_popover',
          on: {
            [EdgeConnectionFinishEvent.TUTORIAL_ROLE1_ATTACHED_TO_USER]: 'role1_attached_popover',
          },
        },
        role1_attached_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'create_your_first_role_popover',
          },
        },
        create_your_first_role_popover: {
          entry: ['next_popover', 'next_role_creation_objectives'],
          on: {
            [RoleCreationFinishEvent.TUTORIAL_ROLE_CREATED]: 'role_creation_finished_popover1',
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
          onDone: 'tutorial_finished_popover1',
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
        tutorial_finished_popover1: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_finished_popover2',
          },
        },
        tutorial_finished_popover2: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          entry: 'next_popover',
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
        }),
        'next_edge_connection_objectives',
        'next_role_creation_objectives',
      ],
      initial: 'inside_level_popup1',
      states: {
        inside_level_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'inside_level_popup2',
          },
        },
        inside_level_popup2: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'inside_level_popup3',
          },
        },
        inside_level_popup3: {
          entry: ['next_popup', 'show_side_panel'],
          on: {
            NEXT_POPUP: 'create_role_and_policy',
          },
        },
        create_role_and_policy: {
          entry: 'hide_popups',
          onDone: 'level_finished_popover',
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
        level_finished_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'level_finished_popup',
          },
        },
        level_finished_popup: {
          entry: ['hide_popovers', 'next_popup'],
        },
      },
    },
  },
});
