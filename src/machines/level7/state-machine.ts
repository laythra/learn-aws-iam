import { and, not } from 'xstate';

import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
// prettier-ignore
import {
  RESOURCE_POLICY_CREATION_OBJECTIVES
} from './objectives/resource-policy-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  ResourcePolicyCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { ElementID } from '@/config/element-ids';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level7_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Resource Based Policies',
    level_description: 'Resource Based Policies',
    level_number: 7,
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
    side_panel_open: false,
    all_policy_creation_objectives: [],
    restricted_element_ids: [
      ElementID.CodeEditorSCPTab,
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorPermissionBoundaryTab,
      ElementID.CreateUserGroupMenuItem,
    ],
    resource_policy_creation_objectives: [],
    layout_groups: COMMON_LAYOUT_GROUPS,
  },
  on: {
    TOGGLE_SIDE_PANEL: { actions: 'toggle_side_panel' },
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ params: event.node_data, nodeType: event.node_entity }),
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
            isInternalConnection: event.isInternalConnection,
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
    [StatefulStateMachineEvent.AddIAMNode]: {
      actions: [
        {
          type: 'add_iam_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            label: event.label,
            accountId: event.account_id,
            policyNodeType: event.node_entity,
          }),
        },
      ],
    },
  },
  states: {
    inside_tutorial: {
      entry: [
        'enable_tutorial_state',
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_NODES } },
        {
          type: 'update_whitelisted_element_ids',
          params: {
            whitelisted_element_ids: [
              ElementID.NewEntityBtn,
              ElementID.CodeEditorResourcePolicyTab,
              ElementID.CreateRolesAndPoliciesMenuItem,
            ],
          },
        },
        { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[0] } },
        {
          type: 'append_creation_objectives',
          params: {
            objectives: RESOURCE_POLICY_CREATION_OBJECTIVES[0],
          },
        },
      ],
      onDone: 'inside_level',
      initial: 'welcoming_message',
      states: {
        welcoming_message: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: 'tutorial_popup1',
          },
        },
        tutorial_popup1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
          on: {
            NEXT_POPUP: ['fixed_popover1'],
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popups',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'create_resource_based_policy',
          },
        },
        create_resource_based_policy: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [ElementID.RightSidePanelToggleButton, ElementID.NewEntityBtn],
                isVisible: true,
              },
            },
          ],
          on: {
            [ResourcePolicyCreationFinishEvent.TUTORIAL_RESOURCE_BASED_POLICY_CREATED]: {
              target: 'access_granted_popover',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.CREATE_TUTORIAL_RESOURCE_BASED_POLICY },
                },
              ],
            },
          },
        },
        access_granted_popover: {
          entry: {
            type: 'show_popover_message',
            params: { message: POPOVER_TUTORIAL_MESSAGES[1] },
          },
          on: {
            NEXT_POPOVER: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          type: 'final',
        },
      },
    },
    inside_level: {
      initial: 'tutorial_popup3',
      entry: [
        'store_checkpoint',
        { type: 'store_snapshot_to_disk', params: { filename: 'level7_stage2' } }, // TODO: Remove this line after testing
        'disable_tutorial_state',
        'clear_edges',
        { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } },
        {
          type: 'update_red_dot_visibility',
          params: {
            elementIds: [ElementID.NewEntityBtn, ElementID.RightSidePanelToggleButton],
            isVisible: false,
          },
        },
      ],
      states: {
        tutorial_popup3: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[2] } },
          on: {
            NEXT_POPUP: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
            'hide_popups',
          ],
          on: {
            NEXT_FIXED_POPOVER: 'resource_node_popover',
          },
        },
        resource_node_popover: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
            'hide_fixed_popovers',
          ],
          on: {
            NEXT_POPOVER: 'user_node_popover',
          },
        },
        user_node_popover: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[3] } },
          ],
          on: {
            NEXT_POPOVER: 'create_identity_policy',
          },
        },
        create_identity_policy: {
          entry: [
            'hide_popovers',
            {
              type: 'update_red_dot_visibility',
              params: { elementIds: [ElementID.NewEntityBtn], isVisible: true },
            },
            {
              type: 'add_restricted_element_ids',
              params: { element_ids: [ElementID.CodeEditorResourcePolicyTab] },
            },
            {
              type: 'append_creation_objectives',
              params: {
                objectives: POLICY_CREATION_OBJECTIVES[0],
              },
            },
            {
              type: 'append_level_objectives',
              params: { objectives: LEVEL_OBJECTIVES[1] },
            },
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[4] },
            },
          ],
          on: {
            [ResourcePolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED]: {
              target: 'attach_identity_policy_to_user',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.CREATE_IN_LEVEL_IDENTITY_POLICY },
                },
              ],
            },
          },
        },
        attach_identity_policy_to_user: {
          entry: [
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
            },
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[5] },
            },
            {
              type: 'update_red_dot_visibility',
              params: { elementIds: [ElementID.NewEntityBtn], isVisible: false },
            },
          ],
          on: {
            [EdgeConnectionFinishEvent.IDENTITY_POLICY_ATTACHED_TO_IAM_USER]: {
              target: 'popover6',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.ATTACH_IDENTITY_BASED_POLICY_TO_USER },
                },
              ],
            },
          },
        },
        popover6: {
          entry: [
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[6] },
            },
          ],
          on: {
            NEXT_POPOVER: 'create_resource_policy',
          },
        },
        create_resource_policy: {
          entry: [
            'store_checkpoint',
            {
              type: 'store_snapshot_to_disk',
              params: { filename: 'level7_stage3' },
            }, // TODO: Remove this line after testing
            {
              type: 'update_red_dot_visibility',
              params: { elementIds: [ElementID.NewEntityBtn], isVisible: true },
            },
            {
              type: 'add_restricted_element_ids',
              params: { element_ids: [ElementID.CodeEditorPolicyTab] },
            },
            {
              type: 'remove_restricted_element_ids',
              params: { element_ids: [ElementID.CodeEditorResourcePolicyTab] },
            },
            { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[2] } },
            {
              type: 'append_creation_objectives',
              params: { objectives: RESOURCE_POLICY_CREATION_OBJECTIVES[1] },
            },
            {
              type: 'show_popover_message',
              params: { message: POPOVER_TUTORIAL_MESSAGES[7] },
            },
          ],
          on: {
            [ResourcePolicyCreationFinishEvent.IN_LEVEL_RESOURCE_BASED_POLICY_CREATED]: {
              target: 'create_and_attach_policies_completed',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.CREATE_IN_LEVEL_RESOURCE_BASED_POLICY },
                },
              ],
            },
          },
        },
        create_and_attach_policies_completed: {
          entry: [
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[8] } },
          ],
          on: {
            NEXT_POPOVER: 'fixed_popover3',
          },
        },
        fixed_popover3: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[2] } },
            'hide_popovers',
          ],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover4',
          },
        },
        fixed_popover4: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[3] } },
          ],
          on: {
            NEXT_FIXED_POPOVER: [
              {
                guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
                target: 'level_completed',
              },
              {
                guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
                target: 'remove_unnecessary_edges_and_nodes',
              },
            ],
          },
        },
        remove_unnecessary_edges_and_nodes: {
          entry: ['show_unncessary_edges_or_nodes_warning', 'hide_fixed_popovers'],
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_completed',
          },
        },
        level_completed: {
          entry: [
            'hide_fixed_popovers',
            'hide_unncessary_edges_or_nodes_warning',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[3] } },
          ],
          type: 'final',
        },
      },
    },
  },
});
