import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_EDIT_OBJECTIVES } from './objectives/policy-role-edit-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap, NodeEditFinishEvent } from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { resolveInitialEdges } from '../utils/initial-edges-resolver';
import { TEMPLATE_GROUP_NODE } from '@/factories/group-node-factory';
import { TEMPLATE_POLICY_NODE } from '@/factories/policy-node-factory';
import { TEMPLATE_USER_NODE } from '@/factories/user-node-factory';
import { theme } from '@/theme';
import { IAMNodeEntity } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  [],
  []
).createMachine({
  id: 'level4_state_machine',
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
    final_edges: [],
    level_objectives: LEVEL_OBJECTIVES,
    side_panel_open: false,
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
    policy_creation_objectives: [],
    policy_edit_objectives: [],
    edges_connection_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
  },
  on: {
    ATTACH_POLICY_TO_ENTITY: {
      actions: [
        {
          type: 'attach_policy_to_entity',
          params: ({ event }) => ({ policyNode: event.sourceNode, entityNode: event.targetNode }),
        },
      ],
    },
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ nodeType: event.node_entity, params: event.node_data }),
        },
      ],
    },
    ADD_IAM_POLICY_NODE: {
      actions: [
        {
          type: 'add_policy_node',
          params: ({ event }) => ({ docString: event.doc_string }),
        },
      ],
    },
    UPDATE_IAM_POLICY_NODE: {
      actions: [
        {
          type: 'update_iam_policy_node',
          params: ({ event }) => ({ nodeId: event.node_id, docString: event.doc_string }),
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
      initial: 'popup1',
      onDone: 'inside_level',
      entry: assign({
        nodes: INITIAL_IN_LEVEL_NODES,
        edges: resolveInitialEdges(INITIAL_IN_LEVEL_NODES),
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
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'popup4',
          },
          exit: 'hide_popups',
        },
        popup4: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'popup5',
          },
          exit: 'hide_popups',
        },
        popup5: {
          entry: ['next_popup', 'toggle_side_panel'],
          on: {
            NEXT_POPUP: 'tutorial_finished',
          },
          exit: 'hide_popups',
        },
        tutorial_finished: {
          type: 'final',
        },
      },
    },
    inside_level: {
      type: 'parallel',
      entry: assign({
        nodes: INITIAL_IN_LEVEL_NODES,
        edges: resolveInitialEdges(INITIAL_IN_LEVEL_NODES),
        policy_edit_objectives: POLICY_EDIT_OBJECTIVES[0],
      }),
      states: {
        fix_developer_policy: {
          initial: 'editing_in_progress',
          states: {
            editing_in_progress: {
              on: {
                [NodeEditFinishEvent.DEVELOPER_POLICY_EDITED]: {
                  target: 'completed',
                  actions: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.DeveloperAnalyticsDataReadAccess },
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
        fix_data_scientist_policy: {
          initial: 'editing_in_progress',
          states: {
            editing_in_progress: {
              on: {
                [NodeEditFinishEvent.DATA_SCIENTIST_POLICY_EDITED]: {
                  target: 'completed',
                  actions: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.DataScientistS3ReadWriteAccess },
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
        fix_interns_policy: {
          initial: 'editing_in_progress',
          states: {
            editing_in_progress: {
              on: {
                [NodeEditFinishEvent.INTERN_POLICY_EDITED]: {
                  target: 'completed',
                  actions: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.InternS3ReadAccess },
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
  },
});
