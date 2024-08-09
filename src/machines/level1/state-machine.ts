import _ from 'lodash';
import type { Edge, Node } from 'reactflow';
import { setup, assign } from 'xstate';

import { POPOVER_TUTORIAL_MESSAGES, POPUP_TUTORIAL_MESSAGES, LEVEL_OBJECTIVES } from './config';
import { initial_nodes, template_nodes, edges } from './nodes';
import type { Context, InsideLevelMetadata, EventData } from './types';
import { CreatableIAMNodeEntity, IAMNodeEntity, type IAMAnyNodeData } from '@/types';
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
    iam_node_creation_side_effects: assign({
      next_iam_node_id: ({ context }, { node }: { node: IAMAnyNodeData }) =>
        _.update(
          { ...context.next_iam_node_id },
          [node.entity],
          _.constant(context.next_iam_node_id[node.entity as CreatableIAMNodeEntity] + 1)
        ),
      next_iam_node_default_position: ({ context }, { node }: { node: IAMAnyNodeData }) => {
        if (node.id in context.fixed_iam_nodes_positions) {
          return context.next_iam_node_default_position;
        } else {
          return {
            x: context.next_iam_node_default_position.x + 20,
            y: context.next_iam_node_default_position.y + 20,
          };
        }
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBswDczIIwH1YBcBDfMHAW0IGMALASwDswA6B2WiU-AV3wHsAnWoWQBiCL0ZMCxZqgzY8REuSp1Jrdpx4ChyANoAGALqJQAB15t8tCaZAAPRFgBMAFgNMAnADYDntwZYAKwAzJ6eADQgAJ6IziEeAOyJIa6uWAYAHJ6JnpkhAL4FUXKYuNLKFDQMzBocONx8gsJMFhYY-FgiAHIAogAaACo4AAoA8uMAar0ASoYmSCAWVjb0do4IWJ4hTFhYiVi+wbnxrplRsQjOic5MBqeuiZlBngb3hcUgpQoVpFVqtXobHqjR0LTavA6zh6A2G4yms3mdmWtGstkWG1cOSYiQMCSwISebyCWHyFziNzuDyeLze8SKJXQZUUMhU1XUQM0DW0zWQrV47TA-BCMKGowmY2mc2MyMsqNW60QmXuONczmC2zCzlekRiFNu7zSNNe7wZXyZPyUf1UNRYnPq3zEEmYvyY33KVrZALtwNI3yRixRaLWGLieO8TCC8XV3j2L28j3JV1COKCbzeqW8uVcqTN7pZlRtHN9OG+TEoEkYlHwOCEZBwFmQtEo0QavBwXFgQrtDf4vCg-DgsBEAEkAIIAWXFABkRwBhACaODnY26fTng16ABEA+Y5cHFZsgkFXExMtdttlo2qQkmQocmM404FvGncXssK4ip96LwOPBFnzX4vRqWUVnRUANgAWjcJMoLVPMLQ9Vl-ltOotCaXQwPlCCHDiVwkwJRJI1OeJvBCElPD2L9PiAz1UOLLlQV5flBU6bCD1DBAbiTbUgkjdMDAODU8hoxl5GQwt2UBEtmN0VjISFZwOIVLjCVPR4EyeEIswMI1eM8fjnzeYSXlExCJILa1pJ9JieXkiEOhCFTcI2LNPDubwAk8dxMmVQkDKMwTTPCTIxPNSzgIYmS7Mwlo5OEHAKzIMxUBICAXJDSDEFE3ZAmPLFvGVNVEgM08nzpMLcW1AwTws5koqLGKHQtTLDwJLYmC8rEQkJe5nFq5wk38JgsVC48CXCII-Pqy0UKa2yWvkctKzAata0IetG2bVs+A7Lt+DariCSzLq3E1aqBqjXjnAjcJwgOe5cioxJvFmyTrO9dDSwtFb6CrGs6wbXgmxbNt9u7Bhe37QdYAAvdwKyvDNnSfjuou-rBrvYJU3TBNtiCRIb3eqyQMYpbMD+gGNq2kGdvBztu2S1KwHSo7ss2ZUPM-PEfLCUJQlvPUEHvU9jKyLE+Jm2ikNJ6K3QtJLeBStLIHZ5HCaTciI2MlxaUyFxvwKIA */
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
    next_iam_node_id: Object.values(IAMNodeEntity).reduce(
      (acc, entity) => ({ ...acc, [entity]: 1 }),
      {}
    ) as { [k in IAMNodeEntity]: number },
    next_iam_node_default_position: { x: 500, y: 500 },
    fixed_iam_nodes_positions: {},
  },
  on: {
    ADD_IAM_USER_NODE: {
      actions: [
        assign({
          nodes: ({ context, event }) => [...context.nodes, event.node],
        }),
        {
          type: 'iam_node_creation_side_effects',
          params: ({ event }) => ({ node: event.node.data }),
        },
      ],
    },
    ADD_IAM_GROUP_NODE: {
      actions: [
        assign({
          nodes: ({ context, event }) => [...context.nodes, event.node],
        }),
        {
          type: 'iam_node_creation_side_effects',
          params: ({ event }) => ({ node: event.node.data }),
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
