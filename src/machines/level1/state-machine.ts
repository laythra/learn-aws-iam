import { and, not } from 'xstate';

import { INITIAL_TUTORIAL_POLICY_NODES } from './nodes/policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from './nodes/resource-nodes';
import { INITIAL_TUTORIAL_USER_NODES } from './nodes/user-nodes';
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
import { PolicyNodeID, UserNodeID } from './types/node-id-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { ElementID } from '@/config/element-ids';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level1_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Introduction to Users and Policies',
    level_description: `
      Learn the fundamentals of IAM by creating users,
      attaching managed policies, and granting them access to specific AWS resources.
    `,
    level_number: 1,
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: LEVEL_OBJECTIVES,
    policy_creation_objectives: [],
    edges_connection_objectives: [],
    policy_edit_objectives: [],
    user_group_creation_objectives: [],
    restricted_element_ids: [ElementID.CreateRolesAndPoliciesMenuItem],
    layout_groups: COMMON_LAYOUT_GROUPS,
  },
  on: {
    ...SHARED_TOP_LEVEL_EVENTS,
  },
  states: {
    inside_tutorial: {
      entry: [
        {
          type: 'assign_nodes',
          params: { nodes: INITIAL_TUTORIAL_USER_NODES },
        },
        {
          type: 'set_user_group_creation_objectives',
          params: { objectives: USER_GROUP_CREATION_OBJECTIVES },
        },
        {
          type: 'set_edge_connection_objectives',
          params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
        },
        'disable_edges_management_ability',
        {
          type: 'update_whitelisted_element_ids',
          params: {
            whitelisted_element_ids: [],
          },
        },
        {
          type: 'update_red_dot_visibility',
          params: {
            isVisible: true,
            elementIds: [ElementID.RightSidePanelToggleButton],
          },
        },
      ],
      initial: 'welcoming_message',
      onDone: 'level_conclusion',
      states: {
        welcoming_message: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: {
              target: 'tutorial_popover1',
            },
          },
        },
        tutorial_popover1: {
          entry: [
            'hide_popups',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
          ],
          on: {
            NEXT_POPOVER: 'tutorial_popover2',
          },
        },
        tutorial_popover2: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[1] },
            },
          ],
          on: {
            NEXT_POPOVER: 'tutorial_popover3',
          },
        },
        tutorial_popover3: {
          entry: {
            type: 'show_popover_message',
            params: { message: POPOVER_TUTORIAL_MESSAGES[2] },
          },
          on: {
            NEXT_POPOVER: 'tutorial_popover4',
          },
        },
        tutorial_popover4: {
          entry: [
            { type: 'append_nodes', params: { nodes: INITIAL_TUTORIAL_RESOURCE_NODES } },
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[3] },
            },
          ],
          on: {
            NEXT_POPOVER: 'tutorial_popover5',
          },
        },
        tutorial_popover5: {
          entry: [
            { type: 'append_nodes', params: { nodes: INITIAL_TUTORIAL_POLICY_NODES } },

            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[4] },
            },
          ],
          on: {
            NEXT_POPOVER: 'attach_policy_to_tutorial_user',
          },
        },
        attach_policy_to_tutorial_user: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[5] } },
            'enable_edges_management_ability',
          ],
          on: {
            [EdgeConnectionFinishEvent.PolicyAttachedToTutorialUser]: {
              target: 'policy_attached_to_tutorial_user_popover',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: {
                    id: LevelObjectiveID.ConnectionTutorialPolicyToTutorialUser,
                  },
                },
                {
                  type: 'hide_node_help_tooltip',
                  params: { nodeId: PolicyNodeID.S3ReadPolicy },
                },
              ],
            },
          },
        },
        policy_attached_to_tutorial_user_popover: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[6] },
            },
          ],
          on: {
            NEXT_POPOVER: 'create_user_popover',
          },
        },
        create_user_popover: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[7] } },
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [
                  ElementID.NewEntityBtn,
                  ElementID.CreateUserGroupMenuItem,
                  ElementID.IdentityCreationPopupUserTab,
                ],
              },
            },
            {
              type: 'update_red_dot_visibility',
              params: {
                isVisible: true,
                elementIds: [ElementID.NewEntityBtn],
              },
            },
          ],
          on: {
            CREATE_IAM_IDENTITY_POPUP_OPENED: {
              target: 'add_your_name_popover',
            },
          },
        },
        add_your_name_popover: {
          entry: {
            type: 'show_popover_message',
            params: { message: POPOVER_TUTORIAL_MESSAGES[8] },
          },
          on: {
            [NodeCreationFinishEvent.USER_NODE_CREATED]: {
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.CreateIAMUser },
                },
              ],
              target: 'connect_iam_policy_to_user',
            },
          },
        },
        connect_iam_policy_to_user: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[9] } },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[1] },
            },
          ],
          on: {
            [EdgeConnectionFinishEvent.PolicyAttachedToCreatedUser]: {
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.GrantIAMUserReadAccessToS3Bucket },
                },
                {
                  type: 'update_red_dot_visibility',
                  params: {
                    isVisible: false,
                    elementIds: [ElementID.NewEntityBtn],
                  },
                },
                {
                  type: 'hide_node_help_tooltip',
                  params: { nodeId: UserNodeID.FirstUser },
                },
              ],
              target: 'policy_attached',
            },
          },
        },
        policy_attached: {
          entry: {
            type: 'show_popover_message',
            params: { message: POPOVER_TUTORIAL_MESSAGES[10] },
          },
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
    level_conclusion: {
      initial: 'level_objectives_popover',
      states: {
        level_objectives_popover: {
          entry: [
            'show_side_panel',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[11] } },
          ],
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
          entry: [
            'hide_unncessary_edges_or_nodes_warning',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
          ],
        },
      },
    },
  },
});
