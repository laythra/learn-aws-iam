import { setup, assign } from 'xstate';

import { TUTORIAL_MESSAGES } from './config';
import { initial_nodes, template_nodes, edges } from './nodes';
import type { Context, InsideLevelMetadata, EventData, TutorialMessage } from '../types';
import { IAMNodeEntity } from '@/types';

export const stateMachine = setup({
  types: {} as {
    context: Context;
    events: EventData;
    meta: InsideLevelMetadata;
  },
  actions: {
    next_popover: assign({
      popover_content: ({ context }) => TUTORIAL_MESSAGES[context.next_popover_index],
      next_popover_index: ({ context }) => context.next_popover_index + 1,
      show_popovers: true,
    }),
    iam_user_creation_side_effects: assign({
      next_iam_user_id: ({ context }) => context.next_iam_user_id + 1,
      next_node_position: ({ context }) => ({
        x: context.next_node_position.x + 20,
        y: context.next_node_position.y + 20,
      }),
    }),
    set_popover_content: assign({
      popover_content: TUTORIAL_MESSAGES[1],
      show_popovers: true,
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
    next_node_position: { x: 100, y: 100 },
    next_popover_index: 0,
    state_name: 'inside_tutorial',
    show_popovers: true,
    popover_content: TUTORIAL_MESSAGES[0],
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
      initial: 'create_user_popover',
      entry: assign({
        state_name: 'inside_tutorial',
      }),
      onDone: 'inside_level',
      states: {
        create_user_popover: {
          entry: assign({
            popover_content: TUTORIAL_MESSAGES[0],
            show_popovers: true,
          }),
          on: {
            CREATE_USER_POPUP_OPENED: {
              target: 'add_your_name_popover',
            },
          },
        },
        add_your_name_popover: {
          entry: assign({
            popover_content: TUTORIAL_MESSAGES[1],
            show_popovers: true,
          }),
          on: {
            IAM_USER_CREATED: {
              actions: 'iam_user_creation_side_effects',
              target: 'iam_user_popover',
            },
          },
        },
        iam_user_popover: {
          entry: assign({
            popover_content: TUTORIAL_MESSAGES[2],
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
            popover_content: TUTORIAL_MESSAGES[3],
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
      entry: assign({
        state_name: 'finished_level',
      }),
      type: 'final',
    },
  },
});
