import { and } from 'xstate';

import { INITIAL_TUTORIAL_CONNECTIONS } from './initial-connections';
import { INITIAL_TUTORIAL_NODES } from './nodes';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_EDIT_OBJECTIVES } from './objectives/policy-role-edit-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap, PolicyEditFinishEvent } from './types/finish-event-enums';
import { PolicyNodeID } from './types/node-ids';
import { LevelObjectiveID } from './types/objective-enums';
import { ElementID } from '@/config/element-ids';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
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
    whitelisted_element_ids: [],
    restricted_element_ids: [ElementID.NewEntityBtn],
    layout_groups: COMMON_LAYOUT_GROUPS,
  },
  on: {
    ...SHARED_TOP_LEVEL_EVENTS,
  },
  states: {
    inside_tutorial: {
      tags: ['tutorial'],
      initial: 'popup_1',
      onDone: 'inside_level',
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_NODES } },
        {
          type: 'apply_initial_node_connections',
          params: { initialConnections: INITIAL_TUTORIAL_CONNECTIONS },
        },
      ],
      states: {
        popup_1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: 'fixed_popover_1',
          },
        },
        fixed_popover_1: {
          entry: [
            'hide_popups',
            {
              type: 'show_fixed_popover_message',
              params: { message: FIXED_POPOVER_MESSAGES[0] },
            },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover_2',
          },
        },
        fixed_popover_2: {
          entry: {
            type: 'show_fixed_popover_message',
            params: { message: FIXED_POPOVER_MESSAGES[1] },
          },
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover_3',
          },
        },
        fixed_popover_3: {
          entry: {
            type: 'show_fixed_popover_message',
            params: { message: FIXED_POPOVER_MESSAGES[2] },
          },
          on: {
            NEXT_FIXED_POPOVER: 'popover_1',
          },
        },
        popover_1: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
          ],
          on: {
            NEXT_POPOVER: 'tutorial_finished',
          },
        },
        tutorial_finished: {
          entry: [
            {
              type: 'show_fixed_popover_message',
              params: { message: FIXED_POPOVER_MESSAGES[3] },
            },
            'hide_popovers',
          ],
          type: 'final',
        },
      },
    },
    inside_level: {
      initial: 'fix_permission_policies',
      entry: [
        {
          type: 'edit_node_attributes',
          params: {
            nodeId: PolicyNodeID.DeveloperPolicy,
            attributes: { editable: true },
          },
        },
        {
          type: 'edit_node_attributes',
          params: {
            nodeId: PolicyNodeID.DataScientistPolicy,
            attributes: { editable: true },
          },
        },
        {
          type: 'edit_node_attributes',
          params: {
            nodeId: PolicyNodeID.InternPolicy,
            attributes: { editable: true },
          },
        },
        {
          type: 'set_permission_policy_edit_objectives',
          params: { objectives: POLICY_EDIT_OBJECTIVES[0] },
        },
        {
          type: 'show_node_help_tooltip',
          params: {
            nodeId: PolicyNodeID.DeveloperPolicy,
            content: "Edit this policy node's content",
          },
        },
        {
          type: 'show_node_help_tooltip',
          params: {
            nodeId: PolicyNodeID.DataScientistPolicy,
            content: "Edit this policy node's content",
          },
        },
        {
          type: 'show_node_help_tooltip',
          params: {
            nodeId: PolicyNodeID.InternPolicy,
            content: "Edit this policy node's content",
          },
        },
      ],
      states: {
        fix_permission_policies: {
          type: 'parallel',
          meta: {
            highlighted_elements: [
              ElementID.IAMNodeContentEditButton,
              ElementID.RightSidePanelToggleButton,
            ],
          },
          onDone: 'fixed_popover_1',
          states: {
            fix_developer_policy: {
              initial: 'editing_in_progress',
              states: {
                editing_in_progress: {
                  on: {
                    [PolicyEditFinishEvent.DEVELOPER_POLICY_EDITED]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.DeveloperAnalyticsDataReadAccess },
                        },
                        {
                          type: 'hide_node_help_tooltip',
                          params: { nodeId: PolicyNodeID.DeveloperPolicy },
                        },
                      ],
                    },
                  },
                },
                completed: {
                  type: 'final',
                  entry: ['store_checkpoint'],
                },
              },
            },
            fix_data_scientist_policy: {
              initial: 'editing_in_progress',
              states: {
                editing_in_progress: {
                  on: {
                    [PolicyEditFinishEvent.DATA_SCIENTIST_POLICY_EDITED]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.DataScientistS3ReadWriteAccess },
                        },
                        {
                          type: 'hide_node_help_tooltip',
                          params: { nodeId: PolicyNodeID.DataScientistPolicy },
                        },
                      ],
                    },
                  },
                },
                completed: {
                  type: 'final',
                  entry: ['store_checkpoint'],
                },
              },
            },
            fix_interns_policy: {
              initial: 'editing_in_progress',
              states: {
                editing_in_progress: {
                  on: {
                    [PolicyEditFinishEvent.INTERN_POLICY_EDITED]: {
                      target: 'completed',
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.InternS3ReadAccess },
                        },
                        {
                          type: 'hide_node_help_tooltip',
                          params: { nodeId: PolicyNodeID.InternPolicy },
                        },
                      ],
                    },
                  },
                },
                completed: {
                  type: 'final',
                  entry: ['store_checkpoint'],
                },
              },
            },
          },
        },
        fixed_popover_1: {
          entry: {
            type: 'show_fixed_popover_message',
            params: { message: FIXED_POPOVER_MESSAGES[4] },
          },
          on: {
            NEXT_FIXED_POPOVER: [
              {
                guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
                target: 'level_completed',
              },
              {
                target: 'remove_unnecessary_edges_and_nodes',
              },
            ],
          },
        },
        remove_unnecessary_edges_and_nodes: {
          entry: ['show_unnecessary_edges_or_nodes_warning', 'hide_popovers'],
          always: {
            guard: and(['no_unnecessary_edges', 'no_unnecessary_nodes']),
            target: 'level_completed',
          },
        },
        level_completed: {
          entry: [
            'store_checkpoint',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
            'hide_fixed_popovers',
            'hide_unnecessary_edges_or_nodes_warning',
          ],
          type: 'final',
        },
      },
    },
  },
});
