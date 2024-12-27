import { assign } from 'xstate';

import { INITIAL_LEVEL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { HIDDEN_LEVEL_OBJECTIVES, LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { USER_GROUP_CREATION_OBJECTIVES } from './objectives/user-group-creation-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap } from './types/finish-event-enums';
import {
  EdgeConnectionFinishEvent,
  UserGroupCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { resolveInitialEdges } from '../utils/initial-edges-resolver';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  [],
  []
).createMachine({
  id: 'level2_state_machine',
  initial: 'tutorial_popup1',
  context: {
    level_title: 'IAM Groups',
    level_description: 'Scaling your IAM setup with groups',
    level_number: 2,
    next_popover_index: 0,
    next_popup_index: 0,
    state_name: 'inside_tutorial',
    show_popovers: false,
    show_popups: false,
    nodes: [],
    metadata_keys: {},
    edges: [],
    level_objectives: LEVEL_OBJECTIVES,
    policy_role_objectives: [],
    policy_role_edit_objectives: [],
    edges_connection_objectives: [],
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
    ATTACH_POLICY_TO_ENTITY: {
      actions: [
        {
          type: 'attach_policy_to_entity',
          params: ({ event }) => ({ policyNode: event.sourceNode, entityNode: event.targetNode }),
        },
      ],
    },
    ATTACH_USER_TO_GROUP: {
      actions: [
        {
          type: 'attach_user_to_group',
          params: ({ event }) => ({ userNode: event.sourceNode, groupNode: event.targetNode }),
        },
      ],
    },
  },
  entry: assign({
    nodes: INITIAL_LEVEL_NODES,
    edges: resolveInitialEdges(INITIAL_LEVEL_NODES),
    user_group_creation_objectives: USER_GROUP_CREATION_OBJECTIVES,
  }),
  states: {
    tutorial_popup1: {
      entry: 'next_popup',
      on: {
        NEXT_POPUP: {
          target: 'tutorial_popup2',
        },
      },
    },
    tutorial_popup2: {
      entry: 'next_popup',
      on: {
        NEXT_POPUP: {
          target: 'tutorial_popup3',
        },
      },
    },
    tutorial_popup3: {
      entry: 'next_popup',
      on: {
        NEXT_POPUP: {
          target: 'tutorial_popup4',
        },
      },
    },
    tutorial_popup4: {
      entry: 'next_popup',
      on: {
        NEXT_POPUP: {
          target: 'create_group_popover',
        },
      },
    },
    create_group_popover: {
      entry: 'next_popover',
      on: {
        CREATE_IAM_IDENTITY_POPUP_OPENED: {
          target: 'select_group_type_popover',
        },
      },
    },
    select_group_type_popover: {
      entry: 'next_popover',
      on: {
        CREATE_IAM_IDENTITY_TAB_CHANGED: {
          target: 'add_group_name_popover',
        },
      },
    },
    add_group_name_popover: {
      entry: 'next_popover',
      on: {
        [UserGroupCreationFinishEvent.GroupCreated]: {
          actions: [
            {
              type: 'change_objective_progress',
              params: { id: 'create_iam_group', finished: true },
            },
          ],
          target: 'attach_nodes_to_group_tooltip',
        },
      },
    },
    attach_nodes_to_group_tooltip: {
      entry: [
        'next_popover',
        assign({
          show_popovers: true,
          edges_connection_objectives: EDGE_CONNECTION_OBJECTIVES[0],
          edges: [],
        }),
      ],
      always: 'attach_nodes_to_group',
    },
    attach_nodes_to_group: {
      type: 'parallel',
      onDone: {
        actions: [
          {
            type: 'change_objective_progress',
            params: { id: LevelObjectiveID.MakeScalingEasier, finished: true },
          },
        ],
        target: 'attach_your_user_to_group',
      },
      states: {
        attach_users: {
          initial: 'in_progress',
          states: {
            in_progress: {
              on: {
                [EdgeConnectionFinishEvent.User1AttachedToGroup]: 'complete',
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
              type: 'parallel',
              onDone: {
                target: 'complete',
              },
              states: {
                policy1_attached: {
                  initial: 'in_progress',
                  states: {
                    in_progress: {
                      on: {
                        [EdgeConnectionFinishEvent.Policy1AttachedToGroup]: 'complete',
                      },
                    },
                    complete: {
                      type: 'final',
                    },
                  },
                },
                policy2_attached: {
                  initial: 'in_progress',
                  states: {
                    in_progress: {
                      on: {
                        [EdgeConnectionFinishEvent.Policy2AttachedToGroup]: 'complete',
                      },
                    },
                    complete: {
                      type: 'final',
                    },
                  },
                },
                policy3_attached: {
                  initial: 'in_progress',
                  states: {
                    in_progress: {
                      on: {
                        [EdgeConnectionFinishEvent.Policy3AttachedToGroup]: 'complete',
                      },
                    },
                    complete: {
                      type: 'final',
                    },
                  },
                },
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
      initial: 'first_user_attached_popover',
      onDone: 'finished_level',
      entry: [
        {
          type: 'add_new_level_objective',
          params: { objectives: HIDDEN_LEVEL_OBJECTIVES },
        },
      ],
      states: {
        first_user_attached_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'create_your_user_popover',
          },
        },
        create_your_user_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'create_your_user',
          },
        },
        create_your_user: {
          entry: 'hide_popovers',
          on: {
            [UserGroupCreationFinishEvent.UserCreated]: {
              target: 'attach_to_group',
            },
          },
        },
        attach_to_group: {
          on: {
            [EdgeConnectionFinishEvent.User2AttachedToGroup]: {
              actions: [
                {
                  type: 'change_objective_progress',
                  params: { id: LevelObjectiveID.AttachUserToGroup, finished: true },
                },
              ],
              target: 'level_finished',
            },
          },
        },
        level_finished: {
          type: 'final',
        },
      },
    },
    finished_level: {
      entry: assign({
        state_name: 'finished_level',
        level_finished: true,
        popover_content: POPOVER_TUTORIAL_MESSAGES[6],
        show_popovers: true,
      }),
      type: 'final',
    },
  },
});
