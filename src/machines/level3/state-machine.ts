import { assign } from 'xstate';

import { INITIAL_TUTORIAL_NODES } from './nodes';
import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_ROLE_CREATION_OBJECTIVES } from './objectives/policy-role-creation-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  NodeCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { GenericContext } from '../types';
import { resolveInitialEdges } from '../utils/initial-edges-resolver';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  POLICY_ROLE_CREATION_OBJECTIVES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level3_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'IAM Groups',
    level_description: 'Scaling your IAM setup with groups',
    level_number: 1,
    next_popover_index: 0,
    next_popup_index: 0,
    state_name: 'inside_tutorial',
    show_popovers: false,
    show_popups: false,
    nodes: [],
    metadata_keys: {},
    edges: [],
    level_objectives: [],
    policy_role_objectives: [],
    policy_role_edit_objectives: [],
    edges_connection_objectives: [],
    user_group_creation_objectives: [],
  },
  on: {
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ nodeType: event.node_entity, params: event.node_data }),
        },
      ],
    },
    // ADD_IAM_USER_NODE: { // TODO: Implement this
    //   actions: [
    //     {
    //       type: 'add_iam_node',
    //       params: ({ event }) => ({ node: event.node }),
    //     },
    //   ],
    // },
    // ADD_IAM_GROUP_NODE: {
    //   actions: [
    //     {
    //       type: 'add_iam_node',
    //       params: ({ event }) => ({ node: event.node }),
    //     },
    //   ],
    // },
    // ADD_EDGE: {
    //   actions: [
    //     assign({
    //       edges: ({ context, event }) => [...context.edges, event.edge],
    //     }),
    //   ],
    // },
    // DELETE_EDGE: {
    //   actions: [
    //     assign({
    //       edges: ({ context, event }) => context.edges.filter(edge => edge.id !== event.edge.id),
    //     }),
    //   ],
    // },
    // SET_NODES: {
    //   actions: assign({
    //     nodes: ({ event }) => event.nodes,
    //   }),
    // },
    // SET_EDGES: {
    //   actions: assign({
    //     edges: ({ event }) => event.edges,
    //   }),
    // },
    // SHOW_POPOVER: {
    //   actions: assign({
    //     popover_content: ({ event }) => event.popover_content,
    //     show_popovers: true,
    //   }),
    //
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
  },
  states: {
    inside_tutorial: {
      initial: 'tutorial_popup1',
      onDone: 'inside_level',
      entry: assign({
        nodes: INITIAL_TUTORIAL_NODES,
        level_objectives: LEVEL_OBJECTIVES,
      }),
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
          on: {
            NEXT_POPUP: 'aws_managed_policy_popover',
          },
        },
        aws_managed_policy_popover: {
          entry: 'next_popover',
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: 'view_policy_content',
          },
        },
        view_policy_content: {
          entry: assign({
            show_popovers: false,
          }),
          after: {
            3000: 'create_your_custom_policy_popover',
          },
        },
        create_your_custom_policy_popover: {
          entry: ['next_popover', 'next_policy_role_objectives', 'show_side_panel'],
          on: {
            [NodeCreationFinishEvent.S3_READ_POLICY_CREATED]: {
              actions: [
                {
                  type: 'change_objective_progress',
                  params: ({
                    context,
                  }: {
                    context: GenericContext<LevelObjectiveID, FinishEventMap>;
                  }) => ({
                    id: Object.keys(context.level_objectives)[0],
                    finished: true,
                  }),
                },
              ],
              target: 'custom_policy_created',
            },
          },
        },
        custom_policy_created: {
          entry: 'next_popover',
          exit: 'hide_popovers',
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
      initial: 'popup1',
      entry: assign({
        level_objectives: LEVEL_OBJECTIVES,
        edges: resolveInitialEdges(INITIAL_IN_LEVEL_NODES),
        nodes: INITIAL_IN_LEVEL_NODES,
        side_panel_open: true,
      }),
      states: {
        popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'popup2',
          },
        },
        popup2: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'popup3',
          },
        },
        popup3: {
          entry: ['next_popup', 'show_side_panel'],
          on: {
            NEXT_POPUP: 'create_and_attach_policies',
          },
          exit: 'hide_popups',
        },
        create_and_attach_policies: {
          entry: ['next_policy_role_objectives', 'next_edge_connection_objectives'],
          type: 'parallel',
          onDone: 'create_and_attach_policies_completed',
          states: {
            create_s3_read_write_policy: {
              initial: 'creation_in_progress',
              states: {
                creation_in_progress: {
                  on: {
                    [NodeCreationFinishEvent.S3_READ_WRITE_POLICY_CREATED]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.S3_READ_WRITE_POLICY_CONNECTED]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'change_objective_progress',
                          params: ({
                            context,
                          }: {
                            context: GenericContext<LevelObjectiveID, FinishEventMap>;
                          }) => ({
                            id: Object.keys(context.level_objectives)[0],
                            finished: true,
                          }),
                        },
                      ],
                    },
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            create_dynamo_read_write_policy: {
              initial: 'creation_in_progress',
              states: {
                creation_in_progress: {
                  on: {
                    [NodeCreationFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CREATED]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EDGE_CONNECTION_OBJECTIVES[0][1].on_finish_event]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'change_objective_progress',
                          params: ({
                            context,
                          }: {
                            context: GenericContext<LevelObjectiveID, FinishEventMap>;
                          }) => ({
                            id: Object.keys(context.level_objectives)[1],
                            finished: true,
                          }),
                        },
                      ],
                    },
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            create_cloudfront_read_policy: {
              initial: 'creation_in_progress',
              states: {
                creation_in_progress: {
                  on: {
                    [NodeCreationFinishEvent.CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EDGE_CONNECTION_OBJECTIVES[0][2].on_finish_event]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'change_objective_progress',
                          params: ({
                            context,
                          }: {
                            context: GenericContext<LevelObjectiveID, FinishEventMap>;
                          }) => ({
                            id: Object.keys(context.level_objectives)[2],
                            finished: true,
                          }),
                        },
                      ],
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
        create_and_attach_policies_completed: {
          type: 'final',
        },
      },
    },
  },
});
