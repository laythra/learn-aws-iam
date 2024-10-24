import _ from 'lodash';
import type { Node } from 'reactflow';
import { setup, assign } from 'xstate';

import {
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  LEVEL_OBJECTIVES,
  POLICY_ROLE_CREATION_OBJECTIVES,
  EDGE_CONNECTION_OBJECTIVES,
  HIDDEN_LEVEL_OBJECTIVES,
} from './config';
import { INITIAL_IN_LEVEL_EDGES, REQUIRED_EDGES } from './edges';
import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { TEMPLATE_GROUP_NODE } from './nodes/group-nodes';
import { TEMPLATE_POLICY_NODE } from './nodes/policy-nodes';
import { TEMPLATE_USER_NODE } from './nodes/user-nodes';
import type { Context, InsideLevelMetadata, EventData, LevelObjective } from './types';
import { PopoverTutorialMessage } from '../types';
import { theme } from '@/theme';
import { CreatableIAMNodeEntity, IAMAnyNodeData, IAMNodeEntity } from '@/types';

export const stateMachine = setup({
  types: {} as {
    context: Context;
    events: EventData;
    meta: InsideLevelMetadata;
  },
  actions: {
    next_popover: assign({
      popover_content: ({ context }) => POPOVER_TUTORIAL_MESSAGES[context.next_popover_index ?? 0],
      show_popovers: ({ context }) => context.next_popover_index < POPOVER_TUTORIAL_MESSAGES.length,
      next_popover_index: ({ context }) => context.next_popover_index + 1,
      show_popups: false,
    }),
    next_popup: assign({
      popup_content: ({ context }) => POPUP_TUTORIAL_MESSAGES[context.next_popup_index],
      show_popups: ({ context }) => context.next_popup_index < POPUP_TUTORIAL_MESSAGES.length,
      next_popup_index: ({ context }) => context.next_popup_index + 1,
      show_popovers: false,
    }),
    next_policy_role_objectives: assign({
      policy_role_objectives: ({ context }) =>
        POLICY_ROLE_CREATION_OBJECTIVES[context.next_policy_role_objectives_index ?? 0],
      next_policy_role_objectives_index: ({ context }) =>
        (context.next_policy_role_objectives_index ?? 0) + 1,
    }),
    next_edge_connection_objectives: assign({
      edges_connection_objectives: ({ context }) =>
        EDGE_CONNECTION_OBJECTIVES[context.next_edges_connection_objectives_index ?? 0],
      next_policy_role_objectives_index: ({ context }) =>
        (context.next_edges_connection_objectives_index ?? 0) + 1,
    }),
    hide_popups: assign({ show_popups: false }),
    hide_popovers: assign({ show_popovers: false }),
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
    set_level_objectives: assign({
      level_objectives: (_context, { objectives }: { objectives: LevelObjective[] }) => objectives,
    }),
    add_iam_node: assign({
      nodes: ({ context }, { node }: { node: Node<IAMAnyNodeData> }) => [...context.nodes, node],
      next_iam_node_id: ({ context }, { node }: { node: Node<IAMAnyNodeData> }) => {
        return _.update(
          { ...context.next_iam_node_id },
          [node.data.entity],
          _.constant(context.next_iam_node_id[node.data.entity as CreatableIAMNodeEntity] + 1)
        );
      },
      next_iam_node_default_position: ({ context }, { node }: { node: Node<IAMAnyNodeData> }) => {
        if (context.fixed_iam_nodes_positions?.[node.id]) {
          return context.next_iam_node_default_position;
        } else {
          return {
            x: context.next_iam_node_default_position.x + 20,
            y: context.next_iam_node_default_position.y + 20,
          };
        }
      },
    }),
    show_popover: assign({
      popover_content: (
        _context_obj,
        { popover_content }: { popover_content: PopoverTutorialMessage }
      ) => popover_content,
      show_popovers: true,
    }),
    show_side_panel: assign({ side_panel_open: true }),
  },
}).createMachine({
  id: 'level3_state_machine',
  initial: 'inside_tutorial',
  context: {
    iam_user_template: TEMPLATE_USER_NODE,
    iam_policy_template: TEMPLATE_POLICY_NODE,
    iam_group_template: TEMPLATE_GROUP_NODE,
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
    final_edges: REQUIRED_EDGES,
    level_objectives: [],
    next_iam_node_id: {
      [IAMNodeEntity.Group]: 1,
      [IAMNodeEntity.User]: 1,
      [IAMNodeEntity.Policy]: 1,
      [IAMNodeEntity.Role]: 1,
    },
    next_iam_node_default_position: {
      x: theme.sizes.iamNodeWidthInPixels / 2,
      y: theme.sizes.iamNodeWidthInPixels / 2,
    },
    policy_role_objectives: [],
    policy_role_edit_objectives: [],
    edges_connection_objectives: [],
  },
  on: {
    ADD_IAM_NODE: {
      actions: [
        {
          type: 'add_iam_node',
          params: ({ event }) => ({ node: event.node }),
        },
      ],
    },
    ADD_IAM_USER_NODE: {
      actions: [
        {
          type: 'add_iam_node',
          params: ({ event }) => ({ node: event.node }),
        },
      ],
    },
    ADD_IAM_GROUP_NODE: {
      actions: [
        {
          type: 'add_iam_node',
          params: ({ event }) => ({ node: event.node }),
        },
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
          entry: ['next_popup'],
          on: {
            NEXT_POPUP: 'tutorial_popup2',
          },
        },
        tutorial_popup2: {
          entry: ['next_popup'],
          on: {
            NEXT_POPUP: 'tutorial_popup3',
          },
        },
        tutorial_popup3: {
          entry: ['next_popup'],
          on: {
            NEXT_POPUP: 'aws_managed_policy_popover',
          },
        },
        aws_managed_policy_popover: {
          entry: ['next_popover'],
          on: {
            IAM_NODE_CONTENT_OPENED: 'view_policy_content',
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
            [POLICY_ROLE_CREATION_OBJECTIVES[0][0].on_finish_event]: {
              actions: [
                {
                  type: 'change_objective_progress',
                  params: ({ context }: { context: Context }) => ({
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
        level_objectives: HIDDEN_LEVEL_OBJECTIVES,
        edges: INITIAL_IN_LEVEL_EDGES,
        nodes: INITIAL_IN_LEVEL_NODES,
        final_edges: REQUIRED_EDGES,
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
                    [POLICY_ROLE_CREATION_OBJECTIVES[1][0].on_finish_event]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EDGE_CONNECTION_OBJECTIVES[0][0].on_finish_event]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'change_objective_progress',
                          params: ({ context }: { context: Context }) => ({
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
                    [POLICY_ROLE_CREATION_OBJECTIVES[1][1].on_finish_event]:
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
                          params: ({ context }: { context: Context }) => ({
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
                    [POLICY_ROLE_CREATION_OBJECTIVES[1][2].on_finish_event]:
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
                          params: ({ context }: { context: Context }) => ({
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
