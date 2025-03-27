import { and, assign, not } from 'xstate';

import { INITIAL_CONNECTIONS } from './initial-connections';
import { INITIAL_LEVEL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { HIDDEN_LEVEL_OBJECTIVES, LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { USER_GROUP_CREATION_OBJECTIVES } from './objectives/user-group-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap } from './types/finish-event-enums';
import {
  EdgeConnectionFinishEvent,
  UserGroupCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { ElementID } from '@/config/element-ids';
import { IAMNodeEntity } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  [],
  [],
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level2_state_machine',
  initial: 'tutorial_popup1',
  context: {
    level_title: 'IAM Groups',
    level_description: 'Scaling your IAM setup with groups',
    level_number: 2,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
    state_name: 'inside_tutorial',
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: LEVEL_OBJECTIVES,
    policy_creation_objectives: [],
    policy_edit_objectives: [],
    edges_connection_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
    identity_creation_popup_default_value: IAMNodeEntity.Group,
    in_tutorial_state: true,
    edges_management_disabled: true,
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    nodes_connnections: [],
    initial_node_connections: INITIAL_CONNECTIONS,
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
    HIDE_POPOVERS: { actions: 'hide_popovers' },
    HIDE_FIXED_POPOVERS: { actions: 'hide_fixed_popovers' },
    NEXT_FIXED_POPOVER: { actions: 'next_fixed_popover' },
    TOGGLE_SIDE_PANEL: {
      actions: assign({
        side_panel_open: ({ context }) => !context.side_panel_open,
      }),
    },
    [StatefulStateMachineEvent.ConnectNodes]: {
      actions: [
        {
          type: 'connect_nodes',
          params: ({ event }) => ({ sourceNode: event.sourceNode, targetNode: event.targetNode }),
        },
      ],
    },
    [StatefulStateMachineEvent.DeleteEdge]: {
      actions: [
        {
          type: 'delete_edge',
          params: ({ event }) => ({ edge: event.edge }),
        },
      ],
    },
    [StatefulStateMachineEvent.DeleteNode]: {
      actions: [
        {
          type: 'delete_node',
          params: ({ event }) => ({ node: event.node }),
        },
      ],
    },
  },
  entry: [
    assign({
      nodes: INITIAL_LEVEL_NODES,
      user_group_creation_objectives: USER_GROUP_CREATION_OBJECTIVES,
    }),
    'resolve_initial_edges',
  ],
  states: {
    tutorial_popup1: {
      entry: 'next_popup',
      on: {
        NEXT_POPUP: {
          target: 'fixed_popover1',
        },
      },
    },
    fixed_popover1: {
      entry: ['hide_popups', 'show_fixed_popover'],
      on: {
        NEXT_FIXED_POPOVER: {
          target: 'fixed_popover2',
        },
      },
    },
    fixed_popover2: {
      entry: 'next_fixed_popover',
      on: {
        NEXT_FIXED_POPOVER: {
          target: 'fixed_popover3',
        },
      },
    },
    fixed_popover3: {
      entry: 'next_fixed_popover',
      on: {
        NEXT_FIXED_POPOVER: {
          target: 'current_user_permissions_popover',
        },
      },
    },
    current_user_permissions_popover: {
      entry: ['hide_fixed_popovers', 'next_popover'],
      on: {
        NEXT_POPOVER: {
          target: 'create_group_popover',
        },
      },
    },
    create_group_popover: {
      entry: [
        'next_popover',
        'show_side_panel',
        'clear_edges',
        {
          type: 'update_whitelisted_element_ids',
          params: {
            whitelisted_element_ids: [
              ElementID.NewEntityBtn,
              ElementID.CreateEntitiesMenuItem,
              ElementID.IdentityCreationPopupGroupTab,
            ],
          },
        },
      ],
      on: {
        CREATE_IAM_IDENTITY_POPUP_OPENED: {
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
      entry: ['next_popover', 'enable_edges_management_ability', 'next_edge_connection_objectives'],
      always: 'attach_nodes_to_group',
    },
    attach_nodes_to_group: {
      type: 'parallel',
      entry: ['clear_edges', 'enable_edges_management_ability'],
      onDone: [
        {
          guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
          actions: [
            {
              type: 'change_objective_progress',
              params: { id: LevelObjectiveID.MakeScalingEasier, finished: true },
            },
          ],
          target: 'remove_unnecessary_edges_and_nodes',
        },
        {
          guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
          actions: [
            {
              type: 'change_objective_progress',
              params: { id: LevelObjectiveID.MakeScalingEasier, finished: true },
            },
          ],
          target: 'attach_your_user_to_group',
        },
      ],
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
    remove_unnecessary_edges_and_nodes: {
      entry: 'show_unncessary_edges_or_nodes_warning',
      always: {
        guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
        target: 'attach_your_user_to_group',
      },
    },
    attach_your_user_to_group: {
      initial: 'first_user_attached_popover',
      onDone: 'finished_level_popover',
      entry: [
        'hide_unncessary_edges_or_nodes_warning',
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
          entry: [
            'disable_tutorial_state',
            'hide_popovers',
            {
              type: 'update_red_dot_visibility',
              params: { isVisible: true, elementIds: [ElementID.NewEntityBtn] },
            },
          ],
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
              target: 'user_attached',
            },
          },
        },
        user_attached: {
          type: 'final',
        },
      },
    },
    finished_level_popover: {
      entry: 'next_popover',
      on: {
        NEXT_POPOVER: [
          {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_complete',
          },
          {
            guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
            target: 'remove_unnecessary_edges_and_nodes_final',
          },
        ],
      },
    },
    remove_unnecessary_edges_and_nodes_final: {
      entry: ['show_unncessary_edges_or_nodes_warning', 'hide_popovers'],
      always: {
        guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
        target: 'level_complete',
      },
    },
    level_complete: {
      entry: ['hide_unncessary_edges_or_nodes_warning', 'next_popup'],
    },
  },
});
