import { and, assign, not } from 'xstate';

import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
import { ROLE_CREATION_OBJECTIVES } from './objectives/role-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  PolicyCreationFinishEvent,
  RoleCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  POLICY_CREATION_OBJECTIVES,
  ROLE_CREATION_OBJECTIVES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level6_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'IAM Roles',
    level_description: 'IAM Roles',
    level_number: 6,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
    state_name: 'inside_tutorial',
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: [],
    policy_creation_objectives: [],
    edges_connection_objectives: [],
    policy_edit_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
    use_multi_account_canvas: true,
    side_panel_open: false,
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    nodes_connnections: [],
    dependency_map: {},
  },
  on: {
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ params: event.node_data, nodeType: event.node_entity }),
        },
      ],
    },
    [StatefulStateMachineEvent.ADDIAMRoleNode]: {
      actions: [
        {
          type: 'add_role_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            accountId: event.account_id,
            label: event.label,
          }),
        },
      ],
    },
    [StatefulStateMachineEvent.ConnectNodes]: {
      actions: [
        {
          type: 'connect_nodes',
          params: ({ event }) => ({
            sourceNode: event.sourceNode,
            targetNode: event.targetNode,
          }),
        },
      ],
    },
    ADD_IAM_POLICY_NODE: {
      actions: [
        {
          type: 'add_policy_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            accountId: event.account_id,
            label: event.label,
          }),
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
    TOGGLE_SIDE_PANEL: { actions: 'toggle_side_panel' },
  },
  states: {
    inside_tutorial: {
      initial: 'tutorial_popup1',
      onDone: 'inside_level',
      entry: [
        assign({
          nodes: INITIAL_IN_LEVEL_NODES,
        }),
        'enable_tutorial_state',
      ],
      states: {
        tutorial_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popup2',
          },
        },
        tutorial_popup2: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: {
              target: 'fixed_popover1',
            },
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popups',
            'show_fixed_popover',
            'show_side_panel',
            assign({
              level_objectives: LEVEL_OBJECTIVES[0],
            }),
          ],
          exit: 'hide_fixed_popovers',
          on: {
            NEXT_FIXED_POPOVER: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          type: 'final',
        },
      },
    },
    inside_level: {
      initial: 'entities_creation',
      entry: ['disable_tutorial_state'],
      states: {
        entities_creation: {
          entry: [
            'next_policy_creation_objectives',
            'next_role_creation_objectives',
            'show_side_panel',
            'next_edge_connection_objectives',
          ],
          type: 'parallel',
          onDone: {
            target: 'level_finished_popover',
            actions: [
              {
                type: 'finish_level_objective',
                params: { id: LevelObjectiveID.GRANT_READ_ACCESS_TO_THIRD_PARTY_USER },
              },
            ],
          },
          states: {
            create_dynamodb_read_policy: {
              initial: 'create_dynamodb_read_policy_in_progress',
              states: {
                create_dynamodb_read_policy_in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.DYNAMODB_READ_POLICY_CREATED]: 'completed',
                  },
                },
                completed: {
                  entry: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.CREATE_DESTINATION_POLICY },
                    },
                  ],
                  type: 'final',
                },
              },
            },
            create_role_for_iam_user: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [RoleCreationFinishEvent.DYNAMODB_READ_ROLE_CREATED]: 'completed',
                  },
                },
                completed: {
                  entry: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.CREATE_IAM_USER_ROLE },
                    },
                  ],
                  type: 'final',
                },
              },
            },
            create_iam_policy_for_assuming_role: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.ASSUME_ROLE_POLICY_CREATED]: 'completed',
                  },
                },
                completed: {
                  entry: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.CREATE_IAM_POLICY_FOR_ASSUMING_ROLE },
                    },
                  ],
                  type: 'final',
                },
              },
            },
            connect_dynamodb_read_policy_to_iam_user_role: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.DYNAMODB_READ_POLICY_ATTACHED_TO_READ_ROLE]:
                      'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            connect_assume_role_policy_to_iam_user: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.ASSUME_ROLE_POLICY_ATTACHED_TO_IAM_USER]:
                      'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            connect_iam_user_to_destination_role: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.IAM_USER_ATTACHED_TO_DYNAMO_READ_ROLE]: 'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
          },
        },
        level_finished_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: [
              {
                guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
                target: 'remove_unnecessary_edges_and_nodes',
              },
              {
                guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
                target: 'level_finished_popup',
              },
            ],
          },
        },
        remove_unnecessary_edges_and_nodes: {
          entry: 'show_unncessary_edges_or_nodes_warning',
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_finished_popup',
          },
        },
        level_finished_popup: {
          entry: ['hide_popovers', 'next_popup'],
        },
      },
    },
  },
});
