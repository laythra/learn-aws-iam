import { assign } from 'xstate';

import { INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { USER_GROUP_CREATION_OBJECTIVES } from './objectives/user-group-creation-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  NodeCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  [],
  [],
  EDGE_CONNECTION_OBJECTIVES
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
    policy_creation_objectives: [],
    edges_connection_objectives: [],
    policy_edit_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
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
    [StatefulStateMachineEvent.AttachPolicyToEntity]: {
      actions: [
        {
          type: 'attach_policy_to_entity',
          params: ({ event }) => ({ policyNode: event.sourceNode, entityNode: event.targetNode }),
        },
      ],
    },
  },
  states: {
    inside_tutorial: {
      entry: [
        assign({
          nodes: INITIAL_TUTORIAL_NODES,
          user_group_creation_objectives: USER_GROUP_CREATION_OBJECTIVES,
        }),
        'next_edge_connection_objectives',
      ],
      initial: 'welcoming_message',
      onDone: 'inside_level',
      states: {
        welcoming_message: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: {
              actions: 'hide_popups',
              target: 'tutorial_popover1',
            },
          },
        },
        tutorial_popover1: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_popover2',
          },
        },
        tutorial_popover2: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_popover3',
          },
        },
        tutorial_popover3: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_popover4',
          },
        },
        tutorial_popover4: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_popover5',
          },
        },
        tutorial_popover5: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'attach_policy_to_tutorial_user',
          },
        },
        attach_policy_to_tutorial_user: {
          entry: 'hide_popovers',
          on: {
            [EdgeConnectionFinishEvent.PolicyAttachedToTutorialUser]:
              'policy_attached_to_tutorial_user_popover',
          },
        },
        policy_attached_to_tutorial_user_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'create_user_popover',
          },
        },
        create_user_popover: {
          entry: 'next_popover',
          on: {
            CREATE_IAM_IDENTITY_POPUP_OPENED: {
              target: 'add_your_name_popover',
            },
          },
        },
        add_your_name_popover: {
          entry: 'next_popover',
          on: {
            [NodeCreationFinishEvent.USER_NODE_CREATED]: {
              actions: [
                {
                  type: 'change_objective_progress',
                  params: { id: LevelObjectiveID.CreateIAMUser, finished: true },
                },
              ],
              target: 'user_created_popover',
            },
          },
        },
        user_created_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_completed',
          },
        },
        tutorial_completed: {
          entry: 'hide_popovers',
          type: 'final',
        },
      },
    },
    inside_level: {
      onDone: 'finished_level',
      initial: 'connect_iam_policy_to_user',
      entry: 'next_edge_connection_objectives',
      states: {
        connect_iam_policy_to_user: {
          on: {
            [EdgeConnectionFinishEvent.PolicyAttachedToCreatedUser]: {
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
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'completed',
          },
        },
        completed: {
          entry: 'hide_popovers',
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
