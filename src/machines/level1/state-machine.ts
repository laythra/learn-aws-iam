import _ from 'lodash';
import type { Edge, Node } from 'reactflow';
import { setup, assign } from 'xstate';

import { POPOVER_TUTORIAL_MESSAGES, POPUP_TUTORIAL_MESSAGES, LEVEL_OBJECTIVES } from './config';
import { initial_nodes, template_nodes, edges } from './nodes';
import type { Context, InsideLevelMetadata, EventData } from './types/state-machine-types';
import { IAMGroupNodeData, IAMUserNodeData } from '@/types';
import { getEdgeName } from '@/utils/names';

export const stateMachine = setup({
  types: {} as {
    context: Context;
    events: EventData;
    meta: InsideLevelMetadata;
  },
  actions: {
    next_popover: assign({
      popover_content: ({ context }) => POPOVER_TUTORIAL_MESSAGES[context.next_popover_index ?? 0],
      next_popover_index: ({ context }) => context.next_popover_index + 1,
      show_popovers: true,
    }),
    hide_popups: assign({ show_popups: false }),
    change_objective_progress: assign({
      level_objectives: ({ context }, { id, finished }: { id: string; finished: boolean }) => ({
        ..._.update(context.level_objectives, [id, 'finished'], _.constant(finished)), // cloning is a must since update returns the same reference
      }),
    }),
  },
}).createMachine({
  id: 'level1_state_machine',
  initial: 'inside_tutorial',
  context: {
    iam_user_template: template_nodes.iam_user as Node<IAMUserNodeData>,
    iam_group_template: template_nodes.iam_group as Node<IAMGroupNodeData>,
    level_title: 'IAM Basics',
    level_description: 'Learn about Identity and Access Management',
    level_number: 1,
    next_popover_index: 0,
    next_popup_index: 0,
    state_name: 'inside_tutorial',
    show_popovers: false,
    show_popups: false,
    nodes: [],
    metadata_keys: {},
    edges: [],
    final_edges: edges,
    level_objectives: LEVEL_OBJECTIVES,
    fixed_iam_nodes_positions: {},
    policy_role_objectives: [],
    edges_connection_objectives: [],
    policy_role_edit_objectives: [],
  },
  on: {
    ADD_IAM_USER_NODE: {
      actions: [
        assign({
          nodes: ({ context, event }) => [...context.nodes, event.node],
        }),
      ],
    },
    ADD_IAM_GROUP_NODE: {
      actions: [
        assign({
          nodes: ({ context, event }) => [...context.nodes, event.node],
        }),
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
  },
  entry: assign({
    nodes: initial_nodes,
  }),
  states: {
    inside_tutorial: {
      initial: 'welcoming_message',
      entry: assign({
        state_name: 'inside_tutorial',
      }),
      onDone: 'inside_level',
      states: {
        welcoming_message: {
          entry: assign({
            show_popups: true,
            popup_content: POPUP_TUTORIAL_MESSAGES[0],
          }),
          on: {
            NEXT_POPUP: {
              actions: 'hide_popups',
              target: 'iam_policy_onboarding_popover',
            },
          },
        },
        iam_policy_onboarding_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[0],
            show_popovers: true,
          }),
          on: {
            NEXT_POPOVER: {
              target: 's3_bucket_onboarding_popover',
            },
          },
        },
        s3_bucket_onboarding_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[1],
            show_popovers: true,
          }),
          on: {
            NEXT_POPOVER: {
              target: 'create_user_popover',
            },
          },
        },
        create_user_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[2],
            show_popovers: true,
          }),
          on: {
            CREATE_IAM_IDENTITY_POPUP_OPENED: {
              target: 'add_your_name_popover',
            },
          },
        },
        add_your_name_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[3],
            show_popovers: true,
          }),
          on: {
            ADD_IAM_USER_NODE: {
              actions: [
                {
                  type: 'change_objective_progress',
                  params: { id: 'create_iam_user', finished: true },
                },
              ],
              target: 'iam_user_popover',
            },
          },
        },
        iam_user_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[4],
            show_popovers: true,
          }),
          on: {
            NEXT_POPOVER: {
              target: 'iam_policy_popover',
              actions: 'next_popover',
            },
          },
        },
        iam_policy_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[5],
            show_popovers: true,
          }),
          on: {
            NEXT_POPOVER: {
              target: 'tutorial_completed',
              actions: 'next_popover',
            },
          },
        },
        tutorial_completed: {
          type: 'final',
        },
      },
    },
    inside_level: {
      onDone: 'finished_level',
      initial: 'connect_iam_policy_to_user',
      entry: assign({
        show_popovers: false,
        state_name: 'inside_level',
        metadata_keys: {
          'level1_state_machine.inside_level.connect_iam_policy_to_user': 'IAM_POLICY_CONNECTED',
          'level1_state_machine.inside_level.create_iam_user': 'IAM_USER_CREATED',
        },
      }),
      states: {
        connect_iam_policy_to_user: {
          meta: {
            connection_targets: [
              {
                required_edges: [
                  _.find(edges, { id: getEdgeName('iam_policy_1', 'iam_user_1') }) as Edge,
                ],
                locked_edges: [
                  _.find(edges, { id: getEdgeName('iam_user_1', 'iam_resource_1') }) as Edge,
                ],
              },
            ],
          },
          on: {
            IAM_POLICY_CONNECTED: {
              target: 'policy_attached',
              actions: [
                {
                  type: 'change_objective_progress',
                  params: { id: 'enable_reading_from_bucket', finished: true },
                },
              ],
            },
          },
        },
        policy_attached: {
          entry: assign({
            show_popovers: true,
            popover_content: POPOVER_TUTORIAL_MESSAGES[6],
          }),
          on: {
            NEXT_POPOVER: 'completed',
          },
        },
        completed: {
          type: 'final',
        },
      },
    },
    finished_level: {
      entry: assign({
        state_name: 'finished_level',
        level_finished: true,
      }),
      type: 'final',
    },
  },
});
