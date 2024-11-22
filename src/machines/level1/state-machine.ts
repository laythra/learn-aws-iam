import { assign, enqueueActions } from 'xstate';

import { INITIAL_TUTORIAL_NODES } from './nodes';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { USER_GROUP_CREATION_OBJECTIVES } from './objectives/user-group-creation-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap } from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  [],
  []
).createMachine({
  id: 'level1_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'IAM Basics',
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
    level_objectives: LEVEL_OBJECTIVES,
    fixed_iam_nodes_positions: {},
    policy_role_objectives: [],
    edges_connection_objectives: [],
    policy_role_edit_objectives: [],
    user_group_creation_objectives: [],
  },
  on: {
    [StatefulStateMachineEvent.AddIAMUserNode]: {
      guard: ({ context }) => context.state_name === 'inside_tutorial',
      actions: [
        {
          type: 'add_iam_user_node',
          params: ({ event }) => ({ params: event.user_node }),
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
    TOGGLE_SIDE_PANEL: {
      actions: assign({
        side_panel_open: ({ context }) => !context.side_panel_open,
      }),
    },
    ATTACH_POLICY_TO_USER: {
      actions: [
        {
          type: 'attach_policy_to_user',
          params: ({ event }) => ({ policyNode: event.sourceNode, userNode: event.targetNode }),
        },
      ],
    },
  },
  states: {
    inside_tutorial: {
      entry: assign({
        nodes: INITIAL_TUTORIAL_NODES,
        user_group_creation_objectives: USER_GROUP_CREATION_OBJECTIVES,
        state_name: 'inside_tutorial',
      }),
      initial: 'welcoming_message',
      onDone: 'inside_level',
      states: {
        welcoming_message: {
          entry: assign({
            show_popups: true,
            popup_content: POPUP_TUTORIAL_MESSAGES[0],
          }),
          on: {
            NEXT_POPUP: {
              actions: 'hide_popups',
              target: 'iam_policy_onboarding_popover',
            },
          },
        },
        iam_policy_onboarding_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[0],
            show_popovers: true,
          }),
          on: {
            NEXT_POPOVER: {
              target: 's3_bucket_onboarding_popover',
            },
          },
        },
        s3_bucket_onboarding_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[1],
            show_popovers: true,
          }),
          on: {
            NEXT_POPOVER: {
              target: 'create_user_popover',
            },
          },
        },
        create_user_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[2],
            show_popovers: true,
          }),
          on: {
            CREATE_IAM_IDENTITY_POPUP_OPENED: {
              target: 'add_your_name_popover',
            },
          },
        },
        add_your_name_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[3],
            show_popovers: true,
          }),
          on: {
            [StatefulStateMachineEvent.AddIAMUserNode]: {
              actions: [
                {
                  type: 'add_iam_user_node',
                  params: ({ event }) => ({ params: event.user_node }),
                },
                {
                  type: 'change_objective_progress',
                  params: { id: LevelObjectiveID.CreateIAMUser, finished: true },
                },
              ],
              // actions: enqueueActions(({ enqueue }) => {
              //   enqueue({
              //     type: 'add_iam_user_node',
              //     params: ({ event }) => ({ params: event.user_node }),
              //   });
              //   enqueue({
              //     type: 'change_objective_progress',
              //     params: { id: LevelObjectiveID.CreateIAMUser, finished: true },
              //   });
              // }),
              target: 'iam_user_popover',
            },
          },
        },
        iam_user_popover: {
          entry: assign({
            popover_content: POPOVER_TUTORIAL_MESSAGES[4],
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
            popover_content: POPOVER_TUTORIAL_MESSAGES[5],
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
      }),
      states: {
        connect_iam_policy_to_user: {
          on: {
            IAM_POLICY_CONNECTED: {
              target: 'policy_attached',
              actions: [
                {
                  type: 'change_objective_progress',
                  params: { id: 'enable_reading_from_bucket', finished: true },
                },
              ],
            },
          },
        },
        policy_attached: {
          entry: assign({
            show_popovers: true,
            popover_content: POPOVER_TUTORIAL_MESSAGES[6],
          }),
          on: {
            NEXT_POPOVER: 'completed',
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
        level_finished: true,
      }),
      type: 'final',
    },
  },
});
