import _ from 'lodash';
import type { Node, Edge } from 'reactflow';
import { setup, assign } from 'xstate';

import {
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  LEVEL_OBJECTIVES,
  HIDDEN_LEVEL_OBJECTIVES,
} from './config';
import { initial_nodes, edges } from './nodes';
import { TEMPLATE_GROUP_NODE, GROUP_NODE_Y_OFFSET } from './nodes/group-nodes';
import { INITIAL_GROUP_NODES } from './nodes/group-nodes';
import { INITIAL_POLICY_NODES } from './nodes/policy-nodes';
import { INITIAL_USER_NODES, TEMPLATE_USER_NODE, USER_NODE_Y_OFFSET } from './nodes/user-nodes';
import type { Context, InsideLevelMetadata, EventData, LevelObjective } from './types';
import { theme } from '@/theme';
import { CreatableIAMNodeEntity, IAMAnyNodeData, IAMNodeEntity } from '@/types';
import { getEdgeName, getNodeName } from '@/utils/names';

const IAM_NODE_WIDTH = theme.sizes.iamNodeWidthInPixels;
const FIRST_CUSTOM_GROUP_ID = INITIAL_GROUP_NODES.length + 1;
const FIRST_CUSTOM_USER_ID = INITIAL_USER_NODES.length + 1;
const FIRST_CUSTOM_POLICY_ID = INITIAL_POLICY_NODES.length + 1;

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
    hide_popups: assign({ show_popups: false }),
    change_objective_progress: assign({
      level_objectives: ({ context }, { id, finished }: { id: string; finished: boolean }) =>
        _.update({ ...context.level_objectives }, [id, 'finished'], _.constant(finished)),
    }),
    add_new_level_objective: assign({
      level_objectives: (
        { context },
        { id, objective }: { id: string; objective: LevelObjective }
      ) => ({
        ...context.level_objectives,
        [id]: objective,
      }),
    }),
    iam_node_creation_side_effects: assign({
      next_iam_node_id: ({ context }, { node }: { node: IAMAnyNodeData }) => {
        console.log('HEREEEEEEE');
        return _.update(
          { ...context.next_iam_node_id },
          [node.entity],
          _.constant(context.next_iam_node_id[node.entity as CreatableIAMNodeEntity] + 1)
        );
      },
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
    add_new_node: assign({
      nodes: ({ context }, { node }: { node: Node }) => [...context.nodes, node],
    }),
  },
}).createMachine({
  id: 'level2_state_machine',
  initial: 'create_group_popover',
  context: {
    iam_user_template: TEMPLATE_USER_NODE,
    iam_group_template: TEMPLATE_GROUP_NODE,
    level_title: 'IAM Groups',
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
    next_iam_node_id: {
      [IAMNodeEntity.Group]: FIRST_CUSTOM_GROUP_ID,
      [IAMNodeEntity.User]: FIRST_CUSTOM_USER_ID,
      [IAMNodeEntity.Policy]: FIRST_CUSTOM_POLICY_ID,
      [IAMNodeEntity.Role]: 1,
    },
    next_iam_node_default_position: {
      x: theme.sizes.iamNodeWidthInPixels / 2,
      y: theme.sizes.iamNodeWidthInPixels / 2,
    },
    fixed_iam_nodes_positions: {
      [getNodeName(IAMNodeEntity.Group, FIRST_CUSTOM_GROUP_ID)]: {
        x: IAM_NODE_WIDTH * 2,
        y: GROUP_NODE_Y_OFFSET,
      },
      [getNodeName(IAMNodeEntity.User, FIRST_CUSTOM_USER_ID)]: {
        x: IAM_NODE_WIDTH * 3.5, // TODO: Find a better way to represent those magic numbers
        y: USER_NODE_Y_OFFSET,
      },
    },
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
        ADD_IAM_GROUP_NODE: {
          actions: [
            assign({
              nodes: ({ context, event }) => [...context.nodes, event.node],
            }),
            {
              type: 'iam_node_creation_side_effects',
              params: ({ event }) => ({ node: event.node.data }),
            },
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
        target: 'attach_your_user_to_group',
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
                      _.find(edges, { id: getEdgeName('iam_policy_3', 'iam_group_1') }) as Edge,
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
    attach_your_user_to_group: {
      entry: [
        {
          type: 'add_new_level_objective',
          params: {
            id: 'attach_your_user_to_group',
            objective: HIDDEN_LEVEL_OBJECTIVES['attach_your_user_to_group'],
          },
        },
        {
          type: 'add_new_node',
          params: {
            node: TEMPLATE_USER_NODE,
          },
        },
        assign({
          metadata_keys: {
            'level2_state_machine.attach_your_user_to_group': 'NEW_USER_ATTACHED_TO_GROUP',
          },
          popover_content: POPOVER_TUTORIAL_MESSAGES[4],
          show_popovers: true,
        }),
      ],
      meta: {
        connection_targets: [
          {
            required_edges: [
              _.find(edges, { id: getEdgeName(TEMPLATE_USER_NODE.id, 'iam_group_1') }) as Edge,
            ],
            locked_edges: [],
          },
        ],
      },
      on: {
        NEW_USER_ATTACHED_TO_GROUP: {
          actions: [
            {
              type: 'change_objective_progress',
              params: { id: 'attach_your_user_to_group', finished: true },
            },
          ],
          target: 'final_groups_popover',
        },
      },
    },
    final_groups_popover: {
      on: {
        NEXT_POPOVER: {
          actions: [
            assign({
              show_popovers: false,
            }),
          ],
          target: 'finished_level',
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
