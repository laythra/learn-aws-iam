import { setup, assign } from 'xstate';

import { TUTORIAL_MESSAGES } from './config';
import { initial_nodes, template_nodes, edges } from './nodes';
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
      show_popovers: true,
    }),
    increment_next_iam_user_id: assign({
      next_iam_user_id: ({ context }) => context.next_iam_user_id + 1,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBswDczIIwH1YBcBDfMHAW0IGMALASwDswA6B2WiU-AV3wHsAnWoWQBiCL0ZMCxZqgzY8REuSp1Jrdpx4ChyANoAGALqJQAB15t8tCaZAAPRFgBMAFgNMAnADYDntwZYAKwAzJ6eADQgAJ6IziEeAOyJIa6uWAYAHJ6JnpkhAL4FUXKYuNLKFDQMzBocONx8gsJMFhYY-FgiAHIAogAaACo4AAoA8uMAar0ASoYmSCAWVjb0do4IWJ4hTFhYiVi+wbnxrplRsQjOic5MBqeuiZlBngb3hcUgpQoVpFVqtXobHqjR0LTavA6zh6A2G4yms3mdmWtGstkWG1cOSYiQMCSwISebyCWHyFziNzuDyeLze8SKJXQZUUMhU1XUQM0DW0zWQrV47TA-BCMKGowmY2mc2MyMsqNW60QmXuONczmC2zCzlekRiFNu7zSNNe7wZXyZPyUf1UNRYnPq3zEEmYvyY33KVrZALtwNI3yRixRaLWGLieO8TCC8XV3j2L28j3JV1COKCbzeqW8uVcqTN7pZlRtHN9OG+TEoEkYlHwOCEZBwFmQtEo0QavBwXFgQrtDf4vCg-DgsBEAEkAIIAWXFABkRwBhACaODnY26fTng16ABEA+Y5cHFZsgkFXExMtdttlo2qQkmQocmM404FvGncXssK4ip96LwOPBFnzX4vRqWUVnRUANgAWjcJMoLVPMLQ9Vl-ltOotCaXQwPlCCHDiVwkwJRJI1OeJvBCElPD2L9PiAz1UOLLlQV5flBU6bCD1DBAbiTbUgkjdMDAODU8hoxl5GQwt2UBEtmN0VjISFZwOIVLjCVPR4EyeEIswMI1eM8fjnzeYSXlExCJILa1pJ9JieXkiEOhCFTcI2LNPDubwAk8dxMmVQkDKMwTTPCTIxPNSzgIYmS7Mwlo5OEHAKzIMxUBICAXJDSDEFE3ZAmPLFvGVNVEgM08nzpMLcW1AwTws5koqLGKHQtTLDwJLYmC8rEQkJe5nFq5wk38JgsVC48CXCII-Pqy0UKa2yWvkctKzAata0IetG2bVs+A7Lt+DariCSzLq3E1aqBqjXjnAjcJwgOe5cioxJvFmyTrO9dDSwtFb6CrGs6wbXgmxbNt9u7Bhe37QdYAAvdwKyvDNnSfjuou-rBrvYJU3TBNtiCRIb3eqyQMYpbMD+gGNq2kGdvBztu2S1KwHSo7ss2ZUPM-PEfLCUJQlvPUEHvU9jKyLE+Jm2ikNJ6K3QtJLeBStLIHZ5HCaTciI2MlxaUyFxvwKIA */
  id: 'level1_state_machine',
  initial: 'inside_tutorial',
  context: {
    iam_user_template: template_nodes.iam_user,
    level_title: 'IAM Basics',
    level_description: 'Learn about Identity and Access Management',
    level_number: 1,
    next_iam_user_id: 1,
    // This is not ideal as it couples the machine to the nodes
    popovers_sequence_ids: [
      'new_entity_btn',
      'username',
      'iam_user1',
      'iam_policy1',
      'iam_resource1',
    ],
    active_popover_index: 0,
    state_name: 'inside_tutorial',
    show_popovers: true,
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
    SET_NODES: {
      actions: assign({
        nodes: ({ event }) => event.nodes,
      }),
    },
    SET_EDGES: {
      actions: assign({
        edges: ({ event }) => event.edges,
      }),
    },
  },
  entry: assign({
    nodes: initial_nodes,
  }),
  states: {
    inside_tutorial: {
      on: {
        HIDE_POPOVERS: {
          actions: assign({ show_popovers: false }),
        },
      },
      initial: 'create_user_popover',
      entry: assign({
        state_name: 'inside_tutorial',
      }),
      onDone: {
        actions: assign({ state_name: 'in_game' }),
        target: 'inside_level',
      },
      states: {
        create_user_popover: {
          meta: TUTORIAL_MESSAGES[0],
          on: {
            CREATE_USER_POPUP_OPENED: {
              target: 'add_your_name_popover',
              actions: 'next_popover',
            },
          },
        },
        add_your_name_popover: {
          meta: TUTORIAL_MESSAGES[1],
          on: {
            IAM_USER_CREATED: {
              actions: ['increment_next_iam_user_id', 'next_popover'],
              target: 'iam_user_popover',
            },
          },
        },
        iam_user_popover: {
          meta: TUTORIAL_MESSAGES[2],
          on: {
            NEXT_POPOVER: {
              target: 'iam_policy_popover',
              actions: 'next_popover',
            },
          },
        },
        iam_policy_popover: {
          meta: TUTORIAL_MESSAGES[3],
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
        create_iam_user: {
          meta: {
            entity_targets: [IAMNodeEntity.User],
          },
          on: {
            IAM_USER_CREATED: {
              target: 'connect_iam_policy_to_user',
            },
          },
        },
        connect_iam_policy_to_user: {
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
    finished_level: {
      type: 'final',
    },
  },
});
