import { assign } from 'xstate';

import { INITIAL_TUTORIAL_NODES } from './nodes';
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
import { UserNodeID } from './types/node-id-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { FIXED_POPOVER_MESSAGES } from '../level2/tutorial_messages/fixed-popover-messages';
import { ElementID } from '@/config/element-ids';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

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
    level_title: 'IAM Introduction',
    level_description: `
      Learn the fundamentals of IAM by creating users,
      attaching managed policies, and granting them access to specific AWS resources.
    `,
    level_number: 1,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
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
    role_creation_objectives: [],
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    nodes_connnections: [],
    restricted_element_ids: [ElementID.CreateRolesAndPoliciesMenuItem],
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
          params: ({ event }) => ({ docString: event.doc_string, label: event.label }),
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
    [StatelessStateMachineEvent.HidePopovers]: { actions: 'hide_popovers' },
    TOGGLE_SIDE_PANEL: { actions: 'toggle_side_panel' },
  },
  states: {
    inside_tutorial: {
      entry: [
        assign({
          nodes: INITIAL_TUTORIAL_USER_NODES,
          user_group_creation_objectives: USER_GROUP_CREATION_OBJECTIVES,
        }),
        'next_edge_connection_objectives',
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
      onDone: 'finished_level',
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
          entry: [
            'next_popover',
            assign({
              highlighted_element_id: UserNodeID.TutorialUser,
            }),
          ],
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
          exit: assign({
            nodes: [...INITIAL_TUTORIAL_USER_NODES, ...INITIAL_TUTORIAL_RESOURCE_NODES],
          }),
        },
        tutorial_popover4: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'tutorial_popover5',
          },
          exit: assign({ nodes: INITIAL_TUTORIAL_NODES }),
        },
        tutorial_popover5: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'attach_policy_to_tutorial_user',
          },
        },
        attach_policy_to_tutorial_user: {
          entry: ['next_popover', 'enable_edges_management_ability'],
          on: {
            [EdgeConnectionFinishEvent.PolicyAttachedToTutorialUser]: {
              target: 'policy_attached_to_tutorial_user_popover',
              actions: [
                {
                  type: 'change_objective_progress',
                  params: {
                    id: LevelObjectiveID.ConnectionTutorialPolicyToTutorialUser,
                    finished: true,
                  },
                },
              ],
            },
          },
        },
        policy_attached_to_tutorial_user_popover: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'create_user_popover',
          },
        },
        create_user_popover: {
          entry: [
            'next_popover',
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [
                  ElementID.NewEntityBtn,
                  ElementID.CreateEntitiesMenuItem,
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
          entry: 'next_popover',
          on: {
            [NodeCreationFinishEvent.USER_NODE_CREATED]: {
              actions: [
                {
                  type: 'change_objective_progress',
                  params: { id: LevelObjectiveID.CreateIAMUser, finished: true },
                },
              ],
              target: 'connect_iam_policy_to_user',
            },
          },
        },
        connect_iam_policy_to_user: {
          entry: ['next_popover', 'next_edge_connection_objectives'],
          on: {
            [EdgeConnectionFinishEvent.PolicyAttachedToCreatedUser]: {
              actions: [
                {
                  type: 'change_objective_progress',
                  params: { id: LevelObjectiveID.GrantIAMUserReadAccessToS3Bucket, finished: true },
                },
                {
                  type: 'update_red_dot_visibility',
                  params: {
                    isVisible: false,
                    elementIds: [ElementID.NewEntityBtn],
                  },
                },
              ],
              target: 'policy_attached',
            },
          },
        },
        policy_attached: {
          entry: 'next_popover',
          on: {
            NEXT_POPOVER: 'level_objectives_popover',
          },
        },
        level_objectives_popover: {
          entry: ['show_side_panel', 'next_popover'],
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
      initial: 'finished_level_popup',
      entry: [
        assign({
          level_finished: true,
        }),
      ],
      states: {
        finished_level_popup: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'finished_level',
          },
        },
        finished_level: {
          type: 'final',
        },
      },
    },
  },
});
