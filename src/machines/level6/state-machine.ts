import { and, assign, not } from 'xstate';

import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
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
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { ElementID } from '@/config/element-ids';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level6_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Cross Account Access',
    level_description: `
      Learn how to grant access across AWS accounts by
      creating trust relationships and assigning cross-account roles.
    `,
    level_number: 6,
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
    restricted_element_ids: [ElementID.CreateEntitiesMenuItem],
    layout_groups: COMMON_LAYOUT_GROUPS,
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
    [StatefulStateMachineEvent.AddIAMNode]: {
      actions: {
        type: 'add_iam_node',
        params: ({ event }) => ({
          docString: event.doc_string,
          label: event.label,
          policyNodeType: event.node_entity,
        }),
      },
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
    [StatelessStateMachineEvent.HidePopovers]: { actions: 'hide_popovers' },
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
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: 'tutorial_popup2',
          },
        },
        tutorial_popup2: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
          on: {
            NEXT_POPUP: {
              target: 'fixed_popover1',
            },
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popups',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
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
      entry: ['disable_tutorial_state', 'clear_creation_objectives'],
      states: {
        entities_creation: {
          entry: [
            {
              type: 'append_creation_objectives',
              params: {
                objectives: POLICY_CREATION_OBJECTIVES[0],
              },
            },
            'show_side_panel',
            {
              type: 'set_edge_connection_objectives',
              params: {
                objectives: EDGE_CONNECTION_OBJECTIVES[0],
              },
            },
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
          entry: {
            type: 'show_popover_message',
            params: { message: POPOVER_TUTORIAL_MESSAGES[0] },
          },
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
          entry: ['hide_popovers', 'show_unncessary_edges_or_nodes_warning'],
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_finished_popup',
          },
        },
        level_finished_popup: {
          entry: [
            'hide_popovers',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[2] } },
          ],
          on: {
            NEXT_POPUP: 'tutorial_finished_popup',
          },
        },
        tutorial_finished_popup: {
          entry: [{ type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[3] } }],
        },
      },
    },
  },
});
