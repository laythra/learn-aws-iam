import { INITIAL_TUTORIAL_NODES } from './nodes';
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
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { DEFAULT_ROLE_POLICY_OBJECTIVES_MAP } from '../config';
import { ElementID } from '@/config/element-ids';
import { IAMNodeEntity } from '@/types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level9_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Tag Based Access Control (TBAC)',
    level_description: 'This level introduces you to Tag Based Access Control (TBAC) in AWS IAM.',
    level_number: 9,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
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
    use_multi_account_canvas: false,
    side_panel_open: false,
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    nodes_connnections: [],
    all_policy_creation_objectives: [],
    restricted_element_ids: [],
    objectives_map: {
      ...DEFAULT_ROLE_POLICY_OBJECTIVES_MAP,
      [IAMNodeEntity.Policy]: { objectives: POLICY_CREATION_OBJECTIVES, current_index: 0 },
    },
  },
  on: {
    TOGGLE_SIDE_PANEL: { actions: 'toggle_side_panel' },
    [StatefulStateMachineEvent.AddIAMPolicyNode]: {
      actions: [
        {
          type: 'add_policy_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            label: event.label,
            policyNodeType: IAMNodeEntity.Policy,
          }),
        },
      ],
    },
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
    [StatefulStateMachineEvent.AddIAMSCPNode]: {
      actions: [
        {
          type: 'add_scp_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            label: event.label,
          }),
        },
      ],
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
    [StatelessStateMachineEvent.HidePopovers]: { actions: 'hide_popovers' },
    [StatelessStateMachineEvent.HideHelpPopover]: { actions: 'hide_help_popover' },
    [StatelessStateMachineEvent.ShowHelpPopover]: { actions: 'show_help_popover' },
  },
  states: {
    inside_tutorial: {
      onDone: 'inside_level',
      initial: 'tutorial_popup1',
      entry: [
        {
          type: 'assign_nodes',
          params: { nodes: INITIAL_TUTORIAL_NODES },
        },
        {
          type: 'add_new_level_objective',
          params: {
            objectives: LEVEL_OBJECTIVES[0],
          },
        },
        'enable_tutorial_state',
      ],
      states: {
        tutorial_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popover1',
          },
        },
        tutorial_popover1: {
          entry: ['hide_popups', 'next_popover'],
          on: {
            [StatelessStateMachineEvent.IAMNodeTagsOpened]: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: ['hide_popovers', 'show_fixed_popover'],
          on: {
            [StatelessStateMachineEvent.IAMNodeTagsPopoverClosed]: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: ['next_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: 'create_tutorial_permission_policy',
          },
        },
        create_tutorial_permission_policy: {
          entry: [
            'hide_fixed_popovers',
            'next_popover',
            {
              type: 'next_policy_role_creation_objectives',
              params: {
                entity: IAMNodeEntity.Policy,
              },
            },
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [
                  ElementID.NewEntityBtn,
                  ElementID.CodeEditorPolicyTab,
                  ElementID.CreateRolesAndPoliciesMenuItem,
                ],
              },
            },
          ],
          on: {
            [PolicyCreationFinishEvent.TUTORIAL_PERMISSION_POLICY_CREATED]:
              'attach_permission_policy_to_users',
          },
        },
        attach_permission_policy_to_users: {
          type: 'parallel',
          entry: ['next_edge_connection_objectives', 'enable_edges_management_ability'],
          onDone: 'fixed_popover3',
          states: {
            attach_policy_to_user1: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  onDone: 'finished',
                  on: {
                    [EdgeConnectionFinishEvent.TUTORIAL_POLICY_CONNECTED_TO_USER1]: 'finished',
                  },
                },
                finished: {
                  type: 'final',
                },
              },
            },
            attach_policy_to_user2: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  onDone: 'finished',
                  on: {
                    [EdgeConnectionFinishEvent.TUTORIAL_POLICY_CONNECTED_TO_USER2]: 'finished',
                  },
                },
                finished: {
                  type: 'final',
                },
              },
            },
          },
        },
        fixed_popover3: {
          entry: ['next_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          entry: ['hide_fixed_popovers', 'hide_popovers'],
          type: 'final',
        },
      },
    },
    inside_level: {},
  },
});
