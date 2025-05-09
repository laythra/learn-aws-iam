import { and, assign, not } from 'xstate';

import { INITIAL_TUTORIAL_CONNECTIONS } from './initial-connections';
import { INITIAL_TUTORIAL_NODES } from './nodes';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_EDIT_OBJECTIVES } from './objectives/policy-role-edit-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap, NodeEditFinishEvent } from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { DEFAULT_ROLE_POLICY_OBJECTIVES_MAP } from '../config';
import { ElementID } from '@/config/element-ids';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  []
).createMachine({
  id: 'level4_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Policy Mastery Exam',
    level_description: `
      Prove your skills by applying everything you've learned. Design,
      connect, and refine IAM entities to meet
      real-world access requirements in this final challenge.
    `,
    level_number: 4,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: LEVEL_OBJECTIVES,
    side_panel_open: false,
    policy_creation_objectives: [],
    policy_edit_objectives: [],
    edges_connection_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    in_tutorial_state: true,
    whitelisted_element_ids: [],
    nodes_connnections: [],
    restricted_element_ids: [ElementID.NewEntityBtn],
    scp_creation_objectives: [],
    all_policy_creation_objectives: [],
    objectives_map: DEFAULT_ROLE_POLICY_OBJECTIVES_MAP,
  },
  on: {
    [StatefulStateMachineEvent.EditIAMPolicyNode]: {
      actions: [
        {
          type: 'edit_policy_node',
          params: ({ event }) => ({ nodeId: event.node_id, docString: event.doc_string }),
        },
      ],
    },
    [StatefulStateMachineEvent.AddIAMPolicyNode]: {
      actions: {
        type: 'add_policy_node',
        params: ({ event }) => ({ docString: event.doc_string, label: event.label }),
      },
    },
    [StatefulStateMachineEvent.ConnectNodes]: {
      actions: [
        {
          type: 'connect_nodes',
          params: ({ event }) => ({ sourceNode: event.sourceNode, targetNode: event.targetNode }),
        },
      ],
    },
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ nodeType: event.node_entity, params: event.node_data }),
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
      initial: 'popup1',
      onDone: 'inside_level',
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_NODES } },
        assign({
          initial_node_connections: INITIAL_TUTORIAL_CONNECTIONS,
        }),
        'resolve_initial_edges',
      ],
      states: {
        popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: ['hide_popups', 'show_fixed_popover'],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: 'next_fixed_popover',
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover3',
          },
        },
        fixed_popover3: {
          entry: 'next_fixed_popover',
          on: {
            NEXT_FIXED_POPOVER: 'popover1',
          },
        },
        popover1: {
          entry: [
            'hide_fixed_popovers',
            'next_popover',
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [
                  ElementID.IAMNodeContentButton,
                  ElementID.CodeEditorPolicyTab,
                ],
              },
            },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          entry: [
            'next_popover',
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [
                  ElementID.RightSidePanelToggleButton,
                  ElementID.IAMNodeContentEditButton,
                ],
                isVisible: true,
              },
            },
          ],
          type: 'final',
        },
      },
    },
    inside_level: {
      initial: 'fix_permission_policies',
      entry: [
        'disable_tutorial_state',
        assign({
          policy_edit_objectives: POLICY_EDIT_OBJECTIVES[0],
        }),
      ],
      states: {
        fix_permission_policies: {
          type: 'parallel',
          onDone: 'editing_finished_fixed_popover',
          states: {
            fix_developer_policy: {
              initial: 'editing_in_progress',
              states: {
                editing_in_progress: {
                  on: {
                    [NodeEditFinishEvent.DEVELOPER_POLICY_EDITED]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.DeveloperAnalyticsDataReadAccess },
                        },
                      ],
                    },
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            fix_data_scientist_policy: {
              initial: 'editing_in_progress',
              states: {
                editing_in_progress: {
                  on: {
                    [NodeEditFinishEvent.DATA_SCIENTIST_POLICY_EDITED]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.DataScientistS3ReadWriteAccess },
                        },
                      ],
                    },
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            fix_interns_policy: {
              initial: 'editing_in_progress',
              states: {
                editing_in_progress: {
                  on: {
                    [NodeEditFinishEvent.INTERN_POLICY_EDITED]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.InternS3ReadAccess },
                        },
                      ],
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
        editing_finished_fixed_popover: {
          entry: 'next_fixed_popover',
          on: {
            NEXT_FIXED_POPOVER: [
              {
                guard: not(and(['no_unnecessary_edges', 'no_unnecessary_nodes'])),
                target: 'remove_unnecessary_edges_and_nodes',
              },
              {
                guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
                target: 'level_finished',
              },
            ],
          },
        },
        remove_unnecessary_edges_and_nodes: {
          entry: ['show_unncessary_edges_or_nodes_warning', 'hide_popovers'],
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_finished',
          },
        },
        level_finished: {
          entry: 'next_popup',
          type: 'final',
        },
      },
    },
  },
});
