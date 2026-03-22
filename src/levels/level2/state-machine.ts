import { and } from 'xstate';

import { INITIAL_CONNECTIONS } from './initial-connections';
import { INITIAL_LEVEL_NODES } from './nodes';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
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
import { ElementID } from '@/config/element-ids';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level2_state_machine',
  initial: 'popup_1',
  context: {
    level_title: 'IAM Groups',
    level_description: `
      Organize and manage users more efficiently
      by using IAM Groups to assign shared permissions.
    `,
    level_number: 2,
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: LEVEL_OBJECTIVES[0],
    policy_creation_objectives: [],
    policy_edit_objectives: [],
    edges_connection_objectives: [],
    user_group_creation_objectives: [],
    edges_management_disabled: true,
    restricted_element_ids: [
      ElementID.CreateRolesAndPoliciesMenuItem,
      ElementID.CodeEditorPermissionBoundaryTab,
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorSCPTab,
      ElementID.CodeEditorResourcePolicyTab,
    ],
    layout_groups: COMMON_LAYOUT_GROUPS,
  },
  on: {
    ...SHARED_TOP_LEVEL_EVENTS,
  },
  entry: [
    { type: 'assign_nodes', params: { nodes: INITIAL_LEVEL_NODES } },
    {
      type: 'apply_initial_node_connections',
      params: { initialConnections: INITIAL_CONNECTIONS },
    },
    {
      type: 'set_user_group_creation_objectives',
      params: { objectives: USER_GROUP_CREATION_OBJECTIVES },
    },
  ],
  states: {
    popup_1: {
      tags: ['tutorial'],
      entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
      on: {
        NEXT_POPUP: {
          target: 'fixed_popover_1',
        },
      },
    },
    fixed_popover_1: {
      tags: ['tutorial'],
      entry: [
        'hide_popups',
        { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
      ],
      on: {
        NEXT_FIXED_POPOVER: {
          target: 'fixed_popover_2',
        },
      },
    },
    fixed_popover_2: {
      tags: ['tutorial'],
      entry: {
        type: 'show_fixed_popover_message',
        params: { message: FIXED_POPOVER_MESSAGES[1] },
      },
      on: {
        NEXT_FIXED_POPOVER: {
          target: 'fixed_popover_3',
        },
      },
    },
    fixed_popover_3: {
      tags: ['tutorial'],
      entry: {
        type: 'show_fixed_popover_message',
        params: { message: FIXED_POPOVER_MESSAGES[2] },
      },
      on: {
        NEXT_FIXED_POPOVER: {
          target: 'current_user_permissions_popover',
        },
      },
    },
    current_user_permissions_popover: {
      tags: ['tutorial'],
      entry: [
        'hide_fixed_popovers',
        { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
      ],
      on: {
        NEXT_POPOVER: {
          target: 'create_group_popover',
        },
      },
    },
    create_group_popover: {
      tags: ['tutorial'],
      entry: [
        { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[1] } },
        'clear_edges',
        {
          type: 'update_whitelisted_element_ids',
          params: {
            whitelisted_element_ids: [
              ElementID.NewEntityBtn,
              ElementID.CreateUserGroupMenuItem,
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
      tags: ['tutorial'],
      entry: { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
      on: {
        [UserGroupCreationFinishEvent.GroupCreated]: {
          actions: [
            {
              type: 'finish_level_objective',
              params: { id: 'create_iam_group' },
            },
          ],
          target: 'attach_nodes_to_group_tooltip',
        },
      },
    },
    attach_nodes_to_group_tooltip: {
      tags: ['tutorial'],
      entry: [
        { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[3] } },
        'enable_edges_management_ability',
        {
          type: 'set_edge_connection_objectives',
          params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
        },
      ],
      always: 'attach_nodes_to_group',
    },
    attach_nodes_to_group: {
      tags: ['tutorial'],
      type: 'parallel',
      entry: ['clear_edges', 'enable_edges_management_ability', 'store_checkpoint'],
      onDone: [
        {
          guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
          actions: [
            {
              type: 'finish_level_objective',
              params: { id: LevelObjectiveID.MakeScalingEasier },
            },
          ],
          target: 'attach_your_user_to_group',
        },
        {
          actions: [
            {
              type: 'finish_level_objective',
              params: { id: LevelObjectiveID.MakeScalingEasier },
            },
          ],
          target: 'remove_unnecessary_edges_and_nodes',
        },
      ],
      states: {
        attach_users: {
          initial: 'in_progress',
          states: {
            in_progress: {
              on: {
                [EdgeConnectionFinishEvent.User1AttachedToGroup]: 'completed',
              },
            },
            completed: {
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
                target: 'completed',
              },
              states: {
                policy1_attached: {
                  initial: 'in_progress',
                  states: {
                    in_progress: {
                      on: {
                        [EdgeConnectionFinishEvent.Policy1AttachedToGroup]: 'completed',
                      },
                    },
                    completed: {
                      type: 'final',
                    },
                  },
                },
                policy2_attached: {
                  initial: 'in_progress',
                  states: {
                    in_progress: {
                      on: {
                        [EdgeConnectionFinishEvent.Policy2AttachedToGroup]: 'completed',
                      },
                    },
                    completed: {
                      type: 'final',
                    },
                  },
                },
                policy3_attached: {
                  initial: 'in_progress',
                  states: {
                    in_progress: {
                      on: {
                        [EdgeConnectionFinishEvent.Policy3AttachedToGroup]: 'completed',
                      },
                    },
                    completed: {
                      type: 'final',
                    },
                  },
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
    remove_unnecessary_edges_and_nodes: {
      entry: 'show_unnecessary_edges_or_nodes_warning',
      always: {
        guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
        target: 'attach_your_user_to_group',
      },
    },
    attach_your_user_to_group: {
      initial: 'first_user_attached_popover',
      onDone: 'finished_level_popover',
      entry: [
        'hide_unnecessary_edges_or_nodes_warning',
        {
          type: 'append_level_objectives',
          params: { objectives: LEVEL_OBJECTIVES[1] },
        },
      ],
      states: {
        first_user_attached_popover: {
          tags: ['tutorial'],
          entry: {
            type: 'show_popover_message',
            params: { message: POPOVER_TUTORIAL_MESSAGES[4] },
          },
          on: {
            NEXT_POPOVER: 'create_your_user_popover',
          },
        },
        create_your_user_popover: {
          tags: ['tutorial'],
          entry: [
            {
              type: 'show_popover_message',

              params: { message: POPOVER_TUTORIAL_MESSAGES[5] },
            },
            'store_checkpoint',
          ],
          on: {
            NEXT_POPOVER: 'create_your_user',
          },
        },
        create_your_user: {
          meta: { highlighted_elements: [ElementID.NewEntityBtn] },
          entry: ['hide_popovers'],
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
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.AttachUserToGroup },
                },
              ],
              target: 'completed',
            },
          },
        },
        completed: {
          type: 'final',
        },
      },
    },
    finished_level_popover: {
      entry: { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[6] } },
      on: {
        NEXT_POPOVER: [
          {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_completed',
          },
          {
            target: 'remove_unnecessary_edges_and_nodes_final',
          },
        ],
      },
    },
    remove_unnecessary_edges_and_nodes_final: {
      entry: ['show_unnecessary_edges_or_nodes_warning', 'hide_popovers'],
      always: {
        guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
        target: 'level_completed',
      },
    },
    level_completed: {
      entry: [
        'store_checkpoint',
        'hide_unnecessary_edges_or_nodes_warning',
        { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
      ],
    },
  },
});
