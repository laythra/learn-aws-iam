import _ from 'lodash';
import type { Node, Edge } from 'reactflow';
import { setup, assign } from 'xstate';

import { POPOVER_TUTORIAL_MESSAGES, POPUP_TUTORIAL_MESSAGES, LEVEL_OBJECTIVES } from './config';
import { initial_nodes, template_nodes, edges } from './nodes';
import type { Context, InsideLevelMetadata, EventData } from './types';
import type { IAMGroupNodeData, IAMUserNodeData } from '@/types';
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
      show_popovers: ({ context }) =>
        context.next_popover_index + 1 < POPOVER_TUTORIAL_MESSAGES.length,
    }),
    next_popup: assign({
      popup_content: ({ context }) => POPUP_TUTORIAL_MESSAGES[context.next_popup_index ?? 0],
      next_popup_index: ({ context }) => context.next_popup_index + 1,
      show_popups: ({ context }) => context.next_popup_index + 1 < POPUP_TUTORIAL_MESSAGES.length,
    }),
    iam_node_creation_side_effects: assign({
      next_iam_node_id: ({ context }) => context.next_iam_node_id + 1,
      next_node_position: ({ context }) => ({
        x: context.next_node_position.x + 20,
        y: context.next_node_position.y + 20,
      }),
    }),
    hide_popups: assign({ show_popups: false }),
    change_objective_progress: assign({
      level_objectives: ({ context }, { id, finished }: { id: string; finished: boolean }) => ({
        // cloning is a must since update returns the same reference
        ..._.update(context.level_objectives, [id, 'finished'], _.constant(finished)),
      }),
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBswDczIIwH1YBcBDfMHAW0IGMALASwDswA6B2WiU-AV3wHsAnWoWQBiCL0ZMCxZqgzY8REuSp1Jrdpx4ChyANoAGALqJQAB15t8tCaZAAPRFgBMAFgNMAnADYDntwZYAKwAzJ6eADQgAJ6IziEeAOyJIa6uWAYAHJ6JnpkhAL4FUXKYuNLKFDQMzBocONx8gsJMFhYY-FgiAHIAogAaACo4AAoA8uMAar0ASoYmSCAWVjb0do4IWJ4hTFhYiVi+wbnxrplRsQjOic5MBqeuiZlBngb3hcUgpQoVpFVqtXobHqjR0LTavA6zh6A2G4yms3mdmWtGstkWG1cOSYiQMCSwISebyCWHyFziNzuDyeLze8SKJXQZUUMhU1XUQM0DW0zWQrV47TA-BCMKGowmY2mc2MyMsqNW60QmXuONczmC2zCzlekRiFNu7zSNNe7wZXyZPyUf1UNRYnPq3zEEmYvyY33KVrZALtwNI3yRixRaLWGLieO8TCC8XV3j2L28j3JV1COKCbzeqW8uVcqTN7pZlRtHN9OG+TEoEkYlHwOCEZBwFmQtEo0QavBwXFgQrtDf4vCg-DgsBEAEkAIIAWXFABkRwBhACaODnY26fTng16ABEA+Y5cHFZsgkFXExMtdttlo2qQkmQocmM404FvGncXssK4ip96LwOPBFnzX4vRqWUVnRUANgAWjcJMoLVPMLQ9Vl-ltOotCaXQwPlCCHDiVwkwJRJI1OeJvBCElPD2L9PiAz1UOLLlQV5flBU6bCD1DBAbiTbUgkjdMDAODU8hoxl5GQwt2UBEtmN0VjISFZwOIVLjCVPR4EyeEIswMI1eM8fjnzeYSXlExCJILa1pJ9JieXkiEOhCFTcI2LNPDubwAk8dxMmVQkDKMwTTPCTIxPNSzgIYmS7Mwlo5OEHAKzIMxUBICAXJDSDEFE3ZAmPLFvGVNVEgM08nzpMLcW1AwTws5koqLGKHQtTLDwJLYmC8rEQkJe5nFq5wk38JgsVC48CXCII-Pqy0UKa2yWvkctKzAata0IetG2bVs+A7Lt+DariCSzLq3E1aqBqjXjnAjcJwgOe5cioxJvFmyTrO9dDSwtFb6CrGs6wbXgmxbNt9u7Bhe37QdYAAvdwKyvDNnSfjuou-rBrvYJU3TBNtiCRIb3eqyQMYpbMD+gGNq2kGdvBztu2S1KwHSo7ss2ZUPM-PEfLCUJQlvPUEHvU9jKyLE+Jm2ikNJ6K3QtJLeBStLIHZ5HCaTciI2MlxaUyFxvwKIA */
  id: 'level2_state_machine',
  initial: 'create_group_popover',
  context: {
    iam_user_template: template_nodes.iam_user as Node<IAMUserNodeData>,
    iam_group_template: template_nodes.iam_group as Node<IAMGroupNodeData>,
    level_title: 'IAM Groups',
    level_description: 'Learn about Identity and Access Management',
    level_number: 1,
    next_iam_node_id: 1,
    next_node_position: { x: 100, y: 100 },
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
    temp: 'temp',
  },
  on: {
    ADD_IAM_NODE: {
      actions: [
        assign({
          nodes: ({ context, event }) => [...context.nodes, event.node],
        }),
        'iam_node_creation_side_effects',
      ],
    },
    UPDATE_IAM_NODE: {
      actions: [
        assign({
          nodes: ({ context, event }) => {
            const updatedNode = event.node;
            return context.nodes.map(node => {
              if (node.id === updatedNode.id) {
                return updatedNode;
              }
              return node;
            });
          },
        }),
      ],
    },
    ADD_EDGE: {
      actions: [
        assign({
          edges: ({ context, event }) => [...context.edges, event.edge],
        }),
      ],
    },
    DELETE_EDGE: {
      actions: [
        assign({
          edges: ({ context, event }) => context.edges.filter(edge => edge.id !== event.edge.id),
        }),
      ],
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
    tutorial_popup1: {
      entry: assign({
        show_popups: true,
        popup_content: POPUP_TUTORIAL_MESSAGES[0],
      }),
      on: {
        NEXT_POPUP: {
          actions: 'next_popup',
          target: 'tutorial_popup2',
        },
      },
    },
    tutorial_popup2: {
      entry: assign({
        show_popups: true,
        popup_content: POPUP_TUTORIAL_MESSAGES[1],
      }),
      on: {
        NEXT_POPUP: {
          actions: 'next_popup',
          target: 'tutorial_popup3',
        },
      },
    },
    tutorial_popup3: {
      entry: assign({
        show_popups: true,
        popup_content: POPUP_TUTORIAL_MESSAGES[2],
      }),
      on: {
        NEXT_POPUP: {
          actions: 'next_popup',
          target: 'tutorial_popup4',
        },
      },
    },
    tutorial_popup4: {
      entry: assign({
        show_popups: true,
        popup_content: POPUP_TUTORIAL_MESSAGES[3],
      }),
      on: {
        NEXT_POPUP: {
          actions: 'next_popup',
          target: 'create_group_popover',
        },
      },
    },
    create_group_popover: {
      entry: assign({
        popover_content: POPOVER_TUTORIAL_MESSAGES[0],
        show_popovers: true,
      }),
      on: {
        CREATE_IAM_IDENTITY_POPUP_OPENED: {
          target: 'select_group_type_popover',
        },
      },
    },
    select_group_type_popover: {
      entry: assign({
        popover_content: POPOVER_TUTORIAL_MESSAGES[1],
        show_popovers: true,
      }),
      on: {
        CREATE_IAM_IDENTITY_TAB_CHANGED: {
          target: 'add_group_name_popover',
        },
      },
    },
    add_group_name_popover: {
      entry: assign({
        popover_content: POPOVER_TUTORIAL_MESSAGES[2],
        show_popovers: true,
      }),
      on: {
        IAM_GROUP_CREATED: {
          actions: [
            {
              type: 'change_objective_progress',
              params: { id: 'create_iam_group', finished: true },
            },
          ],
          target: 'attach_nodes_to_group_tip',
        },
      },
    },
    attach_nodes_to_group_tip: {
      entry: assign({
        popover_content: POPOVER_TUTORIAL_MESSAGES[3],
        show_popovers: true,
      }),
      always: 'attach_nodes_to_group',
    },
    attach_nodes_to_group: {
      type: 'parallel',
      onDone: {
        actions: [
          {
            type: 'change_objective_progress',
            params: { id: 'attach_nodes_to_group', finished: true },
          },
        ],
        target: 'finished_level',
      },
      entry: assign({
        metadata_keys: {
          'level2_state_machine.attach_nodes_to_group.attach_users.in_progress':
            'ALL_USERS_ATTACHED_TO_GROUP',
          'level2_state_machine.attach_nodes_to_group.attach_policies.in_progress':
            'ALL_POLICIES_ATTACHED_TO_GROUP',
        },
      }),
      states: {
        attach_users: {
          initial: 'in_progress',
          states: {
            in_progress: {
              meta: {
                connection_targets: [
                  {
                    required_edges: [
                      _.find(edges, { id: getEdgeName('iam_user_1', 'iam_group_1') }) as Edge,
                      _.find(edges, { id: getEdgeName('iam_user_2', 'iam_group_1') }) as Edge,
                      // _.find(edges, { id: getEdgeName('iam_user_3', 'iam_group_1') }) as Edge,
                    ],
                    locked_edges: [],
                  },
                ],
              },
              on: {
                ALL_USERS_ATTACHED_TO_GROUP: 'complete',
              },
            },
            complete: {
              type: 'final',
            },
          },
        },
        attach_policies: {
          initial: 'in_progress',
          states: {
            in_progress: {
              meta: {
                connection_targets: [
                  {
                    required_edges: [
                      _.find(edges, { id: getEdgeName('iam_policy_1', 'iam_group_1') }) as Edge,
                      _.find(edges, { id: getEdgeName('iam_policy_2', 'iam_group_1') }) as Edge,
                      // _.find(edges, { id: getEdgeName('iam_policy_3', 'iam_group_1') }) as Edge,
                    ],
                    locked_edges: [],
                  },
                ],
              },
              on: {
                ALL_POLICIES_ATTACHED_TO_GROUP: 'complete',
              },
            },
            complete: {
              type: 'final',
            },
          },
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
