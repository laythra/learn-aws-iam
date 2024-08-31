import _ from 'lodash';
import type { Node, Edge } from 'reactflow';
import { setup, assign } from 'xstate';

import { POPOVER_TUTORIAL_MESSAGES, POPUP_TUTORIAL_MESSAGES, LEVEL_OBJECTIVES } from './config';
import { initial_nodes, edges } from './nodes';
import { TEMPLATE_GROUP_NODE, GROUP_NODE_Y_OFFSET } from './nodes/group-nodes';
import { INITIAL_GROUP_NODES } from './nodes/group-nodes';
import { INITIAL_POLICY_NODES, TEMPLATE_POLICY_NODE } from './nodes/policy-nodes';
import { INITIAL_USER_NODES, TEMPLATE_USER_NODE, USER_NODE_Y_OFFSET } from './nodes/user-nodes';
import s3ReadPolicySchema from './schemas/policy/s3-read-policy-schema.json';
import type { Context, InsideLevelMetadata, EventData, LevelObjective } from './types';
import { MANAGED_POLICIES } from '../config';
import { PopoverTutorialMessage } from '../types';
import { theme } from '@/theme';
import { CreatableIAMNodeEntity, IAMAnyNodeData, IAMNodeEntity } from '@/types';
import { getNodeName } from '@/utils/names';

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
    show_popover: assign({
      popover_content: (
        _context_obj,
        { popover_content }: { popover_content: PopoverTutorialMessage }
      ) => popover_content,
      show_popovers: true,
    }),
  },
}).createMachine({
  id: 'level2_state_machine',
  initial: 'create_your_custom_policy_popover',
  // initial: 'tutorial_popup1',
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
        assign({
          nodes: ({ context, event }) => [...context.nodes, event.node],
        }),
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
          target: 'aws_managed_policy_popover',
        },
      },
    },
    aws_managed_policy_popover: {
      entry: assign({
        popover_content: POPOVER_TUTORIAL_MESSAGES[0],
        show_popovers: true,
        show_popups: false,
      }),
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
      entry: assign({
        popover_content: POPOVER_TUTORIAL_MESSAGES[1],
        show_popovers: true,
        scriptable_entities_creation_objectives: [
          {
            entity: IAMNodeEntity.Policy,
            json_schema: s3ReadPolicySchema,
            initial_code: MANAGED_POLICIES.AWSS3ReadOnlyAccess,
            description:
              'Create a policy that allows read access to the S3 bucket: staging-public-images',
            on_finish_event: 'S3_READ_POLICY_CREATED',
            validate_inside_code_editor: true,
          },
        ],
      }),
      on: {
        S3_READ_POLICY_CREATED: 'finished_level',
      },
    },
    finished_level: {
      entry: assign({
        state_name: 'finished_level',
        level_finished: true,
        popover_content: POPOVER_TUTORIAL_MESSAGES[5],
        show_popovers: true,
      }),
      type: 'final',
    },
  },
});
