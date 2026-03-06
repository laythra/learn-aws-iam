import { and, not } from 'xstate';

import { INITIAL_IN_LEVEL_CONNECTIONS } from './initial-connections';
import { LAYOUT_GROUPS } from './layout-groups';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { INITIAL_IN_LEVEL_GROUP_NODES } from './nodes/group-nodes';
import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './nodes/resource-nodes';
import { INITIAL_IN_LEVEL_USER_NODES } from './nodes/user-nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/identity-policy-creation-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  PolicyCreationFinishEvent,
} from './types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from './types/node-id-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { ElementID } from '@/config/element-ids';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level10_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'TBAC: Request Tags',
    level_description: 'TBAC: Request Tags',
    level_number: 10,
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
    side_panel_open: false,
    layout_groups: [...COMMON_LAYOUT_GROUPS, ...LAYOUT_GROUPS],
    restricted_element_ids: [
      ElementID.CreateUserGroupMenuItem,
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorSCPTab,
      ElementID.CodeEditorResourcePolicyTab,
      ElementID.CodeEditorPermissionBoundaryTab,
    ],
  },
  on: { ...SHARED_TOP_LEVEL_EVENTS },
  states: {
    inside_level: {
      entry: [
        {
          type: 'assign_nodes',
          params: { nodes: [...INITIAL_IN_LEVEL_USER_NODES, ...INITIAL_IN_LEVEL_GROUP_NODES] },
        },
        { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[0] } },
        {
          type: 'apply_initial_node_connections',
          params: { initialConnections: INITIAL_IN_LEVEL_CONNECTIONS },
        },
        'disable_edges_management_ability',
      ],
      initial: 'popup1',
      states: {
        popup1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: { NEXT_POPUP: 'popup2' },
        },
        popup2: {
          entry: [{ type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } }],
          on: { NEXT_POPUP: 'popup3' },
        },
        popup3: {
          entry: [{ type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[2] } }],
          on: { NEXT_POPUP: 'create_policy1' },
        },
        create_policy1: {
          entry: [
            'hide_popups',
            'show_side_panel',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
            {
              type: 'append_creation_objectives',
              params: { objectives: POLICY_CREATION_OBJECTIVES[0] },
            },
          ],
          on: {
            [PolicyCreationFinishEvent.ALLOW_CREATE_RDS_WITH_TAGS_POLICY_CREATED]: {
              target: 'attach_policy1_to_groups',
              actions: [
                'close_side_panel',
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.ALLOW_CREATE_RDS_WITH_TAGS_POLICY },
                },
              ],
            },
          },
        },
        attach_policy1_to_groups: {
          type: 'parallel',
          onDone: {
            target: 'level_objective1_finished',
            actions: [
              {
                type: 'finish_level_objective',
                params: { id: LevelObjectiveID.ATTACH_POLICY1_TO_GROUPS },
              },
            ],
          },
          entry: [
            'close_side_panel',
            'store_checkpoint',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[1] } },
            {
              type: 'show_node_help_tooltip',
              params: {
                nodeId: PolicyNodeID.TBACPolicy,
                content: `
                  This policy should be attached to all three groups
                  to meet the objective requirements
                `,
              },
            },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
            },
            'enable_edges_management_ability',
          ],
          states: {
            attach_policy1_to_group1: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: { [EdgeConnectionFinishEvent.TBAC_POLICY_ATTACHED_GROUP1]: 'completed' },
                },
                completed: { type: 'final' },
              },
            },
            attach_policy1_to_group2: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: { [EdgeConnectionFinishEvent.TBAC_POLICY_ATTACHED_GROUP2]: 'completed' },
                },
                completed: { type: 'final' },
              },
            },
            attach_policy1_to_group3: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: { [EdgeConnectionFinishEvent.TBAC_POLICY_ATTACHED_GROUP3]: 'completed' },
                },
                completed: { type: 'final' },
              },
            },
          },
        },
        level_objective1_finished: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
            { type: 'append_nodes', params: { nodes: INITIAL_IN_LEVEL_RESOURCE_NODES } },
            { type: 'hide_node_help_tooltip', params: { nodeId: PolicyNodeID.TBACPolicy } },
          ],
          on: { NEXT_FIXED_POPOVER: 'create_policy2' },
        },
        create_policy2: {
          entry: [
            'store_checkpoint',
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
            { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[1] } },
            {
              type: 'show_node_help_tooltip',
              params: {
                nodeId: ResourceNodeID.RDS1,
                content: 'Create a policy that allows teams to manage their own RDS instances',
              },
            },
            {
              type: 'append_creation_objectives',
              params: { objectives: POLICY_CREATION_OBJECTIVES[1] },
            },
          ],
          on: {
            [PolicyCreationFinishEvent.MANAGE_RDS_POLICY_CREATED]: {
              target: 'attach_policy2_to_groups',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.CREATE_MANAGE_RDS_POLICY },
                },
                {
                  type: 'hide_node_help_tooltip',
                  params: { nodeId: ResourceNodeID.RDS1 },
                },
              ],
            },
          },
        },
        attach_policy2_to_groups: {
          type: 'parallel',
          onDone: [
            {
              target: 'level_objectives_completed',
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.ATTACH_POLICY2_TO_GROUPS },
                },
                {
                  type: 'hide_node_help_tooltip',
                  params: { nodeId: PolicyNodeID.RDSManagePolicy },
                },
              ],
            },
          ],
          entry: [
            'store_checkpoint',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[3] } },
            {
              type: 'show_node_help_tooltip',
              params: {
                nodeId: PolicyNodeID.RDSManagePolicy,
                content: 'Attach this policy to the same groups as the previous one',
              },
            },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[1] },
            },
          ],
          states: {
            attach_policy2_to_group1: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.MANAGE_RDS_POLICY_ATTACHED_GROUP1]: 'completed',
                  },
                },
                completed: { type: 'final' },
              },
            },
            attach_policy2_to_group2: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.MANAGE_RDS_POLICY_ATTACHED_GROUP2]: 'completed',
                  },
                },
                completed: { type: 'final' },
              },
            },
            attach_policy2_to_group3: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.MANAGE_RDS_POLICY_ATTACHED_GROUP3]: 'completed',
                  },
                },
                completed: { type: 'final' },
              },
            },
          },
        },
        level_objectives_completed: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
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
          entry: ['show_unnecessary_edges_or_nodes_warning', 'hide_popovers', 'hide_fixed_popovers'],
          exit: 'hide_unnecessary_edges_or_nodes_warning',
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_completed',
          },
        },
        level_completed: {
          type: 'final',
          entry: [
            'hide_unnecessary_edges_or_nodes_warning',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[3] } },
          ],
        },
      },
    },
  },
});
