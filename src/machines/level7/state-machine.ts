import { and, assign, not } from 'xstate';

import { INITIAL_IN_LEVEL_NODES, INITIAL_TUTORIAL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
import { ROLE_CREATION_OBJECTIVES } from './objectives/role-creation-objectives';
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
import { ElementID } from '@/config/element-ids';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  POLICY_CREATION_OBJECTIVES,
  ROLE_CREATION_OBJECTIVES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level7_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Resource Based Policies',
    level_description: 'Resource Based Policies',
    level_number: 7,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
    state_name: 'inside_tutorial',
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
  },
  on: {
    ADD_IAM_POLICY_NODE: {
      actions: [
        {
          type: 'add_policy_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            accountId: event.account_id,
            label: event.label,
          }),
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
    TOGGLE_SIDE_PANEL: { actions: 'toggle_side_panel' },
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
  states: {
    inside_tutorial: {
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_NODES } },
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
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[0] } },
        'next_policy_creation_objectives',
      ],
      onDone: 'inside_level',
      initial: 'welcoming_message',
      states: {
        welcoming_message: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popup1',
          },
        },
        tutorial_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: ['fixed_popover1'],
          },
        },
        fixed_popover1: {
          entry: ['show_fixed_popover', 'hide_popups'],
          on: {
            NEXT_FIXED_POPOVER: 'create_resource_based_policy',
          },
        },
        create_resource_based_policy: {
          entry: [
            'hide_fixed_popovers',
            'next_popover',
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [ElementID.RightSidePanelToggleButton, ElementID.NewEntityBtn],
                isVisible: true,
              },
            },
          ],
          on: {
            [PolicyCreationFinishEvent.TUTORIAL_RESOURCE_BASED_POLICY_CREATED]: {
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
          entry: 'next_popover',
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
        'disable_tutorial_state',
        'clear_edges',
        { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } },
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[1] } },
        {
          type: 'update_red_dot_visibility',
          params: {
            elementIds: [ElementID.NewEntityBtn, ElementID.RightSidePanelToggleButton],
            isVisible: false,
          },
        },
        assign({ use_multi_account_canvas: true }),
      ],
      states: {
        tutorial_popup3: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: ['next_fixed_popover', 'hide_popups'],
          on: {
            NEXT_FIXED_POPOVER: 'resource_node_popover',
          },
        },
        resource_node_popover: {
          entry: ['next_popover', 'hide_fixed_popovers'],
          on: {
            NEXT_POPOVER: 'user_node_popover',
          },
        },
        user_node_popover: {
          entry: ['next_popover'],
          on: {
            NEXT_POPOVER: 'create_nodes_and_edges',
          },
        },
        create_nodes_and_edges: {
          type: 'parallel',
          onDone: 'create_and_attach_policies_completed',
          entry: [
            'hide_popovers',
            'next_edge_connection_objectives',
            'next_policy_creation_objectives',
            'show_side_panel',
          ],
          states: {
            create_identity_policy: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED]: {
                      target: 'finished',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.CREATE_IN_LEVEL_IDENTITY_POLICY },
                        },
                      ],
                    },
                  },
                },
                finished: {
                  type: 'final',
                },
              },
            },
            create_resource_policy: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.IN_LEVEL_RESOURCE_BASED_POLICY_CREATED]: {
                      target: 'finished',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.CREATE_IN_LEVEL_RESOURCE_BASED_POLICY },
                        },
                      ],
                    },
                  },
                },
                finished: {
                  type: 'final',
                },
              },
            },
            attach_identity_policy_to_user: {
              initial: 'in_progress',
              states: {
                in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.IDENTITY_POLICY_ATTACHED_TO_IAM_USER]: {
                      target: 'finished',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.ATTACH_IDENTITY_BASED_POLICY_TO_USER },
                        },
                      ],
                    },
                  },
                },
                finished: {
                  type: 'final',
                },
              },
            },
          },
        },
        create_and_attach_policies_completed: {
          entry: ['hide_unncessary_edges_or_nodes_warning', 'next_popover'],
          on: {
            NEXT_POPOVER: 'fixed_popover3',
          },
        },
        fixed_popover3: {
          entry: ['next_fixed_popover', 'hide_popovers'],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover4',
          },
        },
        fixed_popover4: {
          entry: ['next_fixed_popover'],
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
          entry: ['show_unncessary_edges_or_nodes_warning', 'hide_popovers'],
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'create_and_attach_policies_completed',
          },
        },
        level_completed: {
          entry: ['hide_fixed_popovers', 'next_popup'],
          type: 'final',
        },
      },
    },
  },
});
