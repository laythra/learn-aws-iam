import { and, assign, not } from 'xstate';

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
    in_tutorial_state: true,
    whitelisted_element_ids: [],
    restricted_element_ids: [ElementID.NewEntityBtn],
    layout_groups: COMMON_LAYOUT_GROUPS,
  },
  on: {
    ...SHARED_TOP_LEVEL_EVENTS,
  },
  states: {
    inside_tutorial: {
      initial: 'popup1',
      onDone: 'inside_level',
      entry: [
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_NODES } },
        {
          type: 'apply_initial_node_connections',
          params: { initialConnections: INITIAL_TUTORIAL_CONNECTIONS },
        },
      ],
      states: {
        popup1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popups',
            {
              type: 'show_fixed_popover_message',
              params: { message: FIXED_POPOVER_MESSAGES[0] },
            },
          ],
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover2',
          },
        },
        fixed_popover2: {
          entry: {
            type: 'show_fixed_popover_message',
            params: { message: FIXED_POPOVER_MESSAGES[1] },
          },
          on: {
            NEXT_FIXED_POPOVER: 'fixed_popover3',
          },
        },
        fixed_popover3: {
          entry: {
            type: 'show_fixed_popover_message',
            params: { message: FIXED_POPOVER_MESSAGES[2] },
          },
          on: {
            NEXT_FIXED_POPOVER: 'popover1',
          },
        },
        popover1: {
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
                    [PolicyEditFinishEvent.DEVELOPER_POLICY_EDITED]: {
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
        editing_finished_fixed_popover: {
          entry: {
            type: 'show_fixed_popover_message',
            params: { message: FIXED_POPOVER_MESSAGES[4] },
          },
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
          entry: [
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
            'hide_fixed_popovers',
            'hide_unncessary_edges_or_nodes_warning',
          ],
          type: 'final',
        },
      },
    },
  },
});
