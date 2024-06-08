import { setup, assign } from 'xstate';

import { TUTORIAL_MESSAGES } from './config';
import { nodes, edges } from './nodes';
import type { Context, InsideLevelMetadata, InsideTutorialMetadata, EventData } from '../types';
import { IAMNodeEntity } from '@/types';

export const stateMachine = setup({
  types: {} as {
    context: Context;
    events: EventData;
    meta: InsideLevelMetadata | InsideTutorialMetadata;
  },
  actions: {
    next_popover: assign({
      active_popover_index: ({ context }) =>
        (context.active_popover_index + 1) % context.popovers_sequence_ids.length,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBswDczIIwH1YBcBDfMHAW0IGMALASwDswA6B2WiU-AV3wHsAnWoWQBiCL0ZMCxZqgzY8REuSp1Jrdpx4ChyANoAGALqJQAB15t8tCaZAAPRFgBMAFgNMAnADYDntwZYAKwAzJ6eADQgAJ6IziEeAOyJIa6uWAYAHJ6JnpkhAL4FUXKYuNLKFDQMzBocONx8gsJMFhYY-FgiAHIAogAaACo4AAoA8uMAar0ASoYmSCAWVjb0do4IWJ4hTFhYiVi+wbnxrplRsQjOic5MBqeuiZlBngb3hcUgpQoVpFVqtXobHqjR0LTavA6zh6A2G4yms3mdmWtGstkWG1cOSYiQMCSwISebyCWHyFziNzuDyeLze8SKJXQZUUMhU1XUQM0DW0zWQrV47TA-BCMKGowmY2mc2MyMsqNW60QmXuONczmC2zCzlekRiFNu7zSNNe7wZXyZPyUf1UNRYnPq3zEEmYvyY33KVrZALtwNI3yRixRaLWGLieO8TCC8XV3j2L28j3JV1COKCbzeqW8uVcqTN7pZlRtHN9OG+TEoEkYlHwOCEZBwFmQtEo0QavBwXFgQrtDf4vCg-DgsBEAEkAIIAWXFABkRwBhACaODnY26fTng16ABEA+Y5cHFZsgkFXExMtdttlo2qQkmQocmM404FvGncXssK4ip96LwOPBFnzX4vRqWUVnRUANgAWjcJMoLVPMLQ9Vl-ltOotCaXQwPlCCHDiVwkwJRJI1OeJvBCElPD2L9PiAz1UOLLlQV5flBU6bCD1DBAbiTbUgkjdMDAODU8hoxl5GQwt2UBEtmN0VjISFZwOIVLjCVPR4EyeEIswMI1eM8fjnzeYSXlExCJILa1pJ9JieXkiEOhCFTcI2LNPDubwAk8dxMmVQkDKMwTTPCTIxPNSzgIYmS7Mwlo5OEHAKzIMxUBICAXJDSDEFE3ZAmPLFvGVNVEgM08nzpMLcW1AwTws5koqLGKHQtTLDwJLYmC8rEQkJe5nFq5wk38JgsVC48CXCII-Pqy0UKa2yWvkctKzAata0IetG2bVs+A7Lt+DariCSzLq3E1aqBqjXjnAjcJwgOe5cioxJvFmyTrO9dDSwtFb6CrGs6wbXgmxbNt9u7Bhe37QdYAAvdwKyvDNnSfjuou-rBrvYJU3TBNtiCRIb3eqyQMYpbMD+gGNq2kGdvBztu2S1KwHSo7ss2ZUPM-PEfLCUJQlvPUEHvU9jKyLE+Jm2ikNJ6K3QtJLeBStLIHZ5HCaTciI2MlxaUyFxvwKIA */
  id: 'level1_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'IAM Basics',
    level_description: 'Learn about Identity and Access Management',
    level_number: 1,
    // This is not ideal as it couples the machine to the nodes
    popovers_sequence_ids: [
      'new_entity_btn',
      'username',
      'iam_policy1',
      'iam_user1',
      'iam_resource1',
    ],
    active_popover_index: 0,
    state_name: 'inside_tutorial',
    inside_tutorial: true,
    nodes: [],
    metadata_keys: {},
    edges: [],
  },
  on: {
    ADD_IAM_NODE: {
      actions: assign({
        nodes: ({ context, event }) => [...context.nodes, event.node],
      }),
    },
    ADD_EDGE: {
      actions: assign({
        edges: ({ context, event }) => [...context.edges, event.edge],
      }),
    },
    SET_EDGES: {
      actions: assign({
        edges: ({ event }) => event.edges,
      }),
    },
  },
  entry: assign({
    nodes: nodes,
  }),
  states: {
    inside_tutorial: {
      initial: 'popover1',
      entry: assign({
        state_name: 'inside_tutorial',
      }),
      onDone: {
        actions: assign({ state_name: 'in_game' }),
        target: 'inside_level',
      },
      states: {
        popover1: {
          meta: TUTORIAL_MESSAGES[0],
          on: {
            NEXT_POPOVER: {
              target: 'popover2',
              actions: 'next_popover',
            },
          },
        },
        popover2: {
          meta: TUTORIAL_MESSAGES[1],
          on: {
            NEXT_POPOVER: {
              target: 'popover3',
              actions: 'next_popover',
            },
          },
        },
        popover3: {
          meta: TUTORIAL_MESSAGES[2],
          on: {
            NEXT_POPOVER: {
              actions: 'next_popover',
              target: 'tutorial_completed',
            },
          },
        },
        tutorial_completed: {
          type: 'final',
        },
      },
    },
    inside_level: {
      type: 'parallel',
      onDone: 'level_completed',
      entry: assign({
        inside_tutorial: false,
        state_name: 'inside_level',
        metadata_keys: {
          'level1_state_machine.inside_level.connect_iam_policy_to_user.in_progress':
            'IAM_POLICY_CONNECTED',
        },
      }),
      states: {
        connect_iam_policy_to_user: {
          initial: 'in_progress',
          states: {
            in_progress: {
              meta: {
                connection_targets: [
                  {
                    required_edges: [edges['e-iam_policy1-iam_user1']],
                    locked_edges: [edges['e-iam_user1-iam_resource1']],
                  },
                ],
              },
              on: {
                IAM_POLICY_CONNECTED: {
                  target: 'completed',
                },
              },
            },
            completed: {
              type: 'final',
            },
          },
        },
        // create_iam_user: {
        //   initial: 'in_progress',
        //   meta: {
        //     connection_targets: [
        //       {
        //         required_edges: [edges['e-iam_policy1-iam_user1']],
        //         locked_edges: [edges['e-iam_user1-iam_resource1']],
        //       },
        //     ],
        //   },
        //   states: {
        //     in_progress: {
        //       on: {
        //         IAM_USER_CREATED: {
        //           target: 'completed',
        //         },
        //       },
        //     },
        //     completed: {
        //       type: 'final',
        //     },
        //   },
        // },
      },
    },
    level_completed: {
      type: 'final',
    },
  },
});
