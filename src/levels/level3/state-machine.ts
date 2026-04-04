import { and } from 'xstate';

import { INITIAL_IN_LEVEL_CONNECTIONS } from './initial-connections';
import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { COMMON_LAYOUT_GROUPS } from '../consts';
import { SHARED_TOP_LEVEL_EVENTS } from '../shared-top-level-events';
import { INITIAL_TUTORIAL_POLICY_NODES } from './nodes/identity-policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from './nodes/resource-nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/identity-policy-creation-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  NodeCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { ElementID } from '@/config/element-ids';
import { VoidEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<
  LevelObjectiveID,
  FinishEventMap
>().createMachine({
  id: 'level3_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Customer Managed Policies',
    level_description: `
      Write custom IAM policies and attach them directly to users, groups, or resources.
    `,
    level_number: 3,
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: [],
    policy_creation_objectives: [],
    policy_edit_objectives: [],
    edges_connection_objectives: [],
    user_group_creation_objectives: [],
    restricted_element_ids: [
      ElementID.CodeEditorRoleTab,
      ElementID.CodeEditorSCPTab,
      ElementID.CodeEditorResourcePolicyTab,
      ElementID.CodeEditorPermissionBoundaryTab,
      ElementID.CreateUserGroupMenuItem,
    ],
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
        { type: 'assign_nodes', params: { nodes: INITIAL_TUTORIAL_POLICY_NODES } },
        { type: 'set_level_objectives', params: { objectives: LEVEL_OBJECTIVES[0] } },
      ],
      states: {
        popup_1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[0] } },
          on: {
            NEXT_POPUP: 'popup_2',
          },
        },
        popup_2: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[1] } },
          on: {
            NEXT_POPUP: 'popup_3',
          },
        },
        popup_3: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[2] } },
          on: {
            NEXT_POPUP: 'aws_managed_policy_popover',
          },
        },
        aws_managed_policy_popover: {
          entry: [
            'hide_popups',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[0] } },
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [ElementID.IAMNodeContentButton],
              },
            },
          ],
          on: {
            [VoidEvent.IAMNodeContentOpened]: 'fixed_popover_1',
          },
        },
        fixed_popover_1: {
          entry: [
            'hide_popovers',
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[0] } },
          ],
          on: {
            [VoidEvent.IAMNodeContentClosed]: 'fixed_popover_2',
          },
        },
        fixed_popover_2: {
          entry: [
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[1] } },
          ],
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
            NEXT_FIXED_POPOVER: 's3_bucket_introduction',
          },
        },
        s3_bucket_introduction: {
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[1] } },
            { type: 'show_fixed_popover_message', params: { message: FIXED_POPOVER_MESSAGES[3] } },
            { type: 'append_nodes', params: { nodes: INITIAL_TUTORIAL_RESOURCE_NODES } },
          ],
          on: {
            [VoidEvent.IAMNodeARNOpened]: 'copy_arn',
          },
        },
        copy_arn: {
          entry: ['hide_popovers'],
          on: {
            [VoidEvent.IAMNodeARNCopied]: 'create_your_custom_policy_popover',
          },
        },
        create_your_custom_policy_popover: {
          meta: {
            highlighted_elements: [
              ElementID.NewEntityBtn,
              ElementID.CreateRolesAndPoliciesMenuItem,
            ],
          },
          entry: [
            'hide_fixed_popovers',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[2] } },
            {
              type: 'append_creation_objectives',
              params: { objectives: POLICY_CREATION_OBJECTIVES[0] },
            },
            {
              type: 'append_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [
                  ElementID.NewEntityBtn,
                  ElementID.CreateRolesAndPoliciesMenuItem,
                  ElementID.CodeEditorPolicyTab,
                ],
              },
            },
          ],
          on: {
            [NodeCreationFinishEvent.S3_READ_POLICY_CREATED]: {
              actions: [
                {
                  type: 'finish_level_objective',
                  params: { id: LevelObjectiveID.CreateFirstCustomerManagedPolicy },
                },
              ],
              target: 'custom_policy_created',
            },
          },
        },
        custom_policy_created: {
          entry: {
            type: 'show_popover_message',
            params: { message: POPOVER_TUTORIAL_MESSAGES[3] },
          },
          on: {
            NEXT_POPOVER: {
              target: 'tutorial_finished',
              actions: ['hide_popovers', 'close_side_panel'],
            },
          },
        },
        tutorial_finished: {
          type: 'final',
        },
      },
    },
    inside_level: {
      initial: 'popup_1',
      entry: [
        'clear_creation_objectives',
        'store_checkpoint',
        { type: 'append_level_objectives', params: { objectives: LEVEL_OBJECTIVES[1] } },
        { type: 'assign_nodes', params: { nodes: INITIAL_IN_LEVEL_NODES } },
        {
          type: 'apply_initial_node_connections',
          params: { initialConnections: INITIAL_IN_LEVEL_CONNECTIONS },
        },
        'show_side_panel',
      ],
      states: {
        popup_1: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[3] } },
          on: {
            NEXT_POPUP: 'popup_2',
          },
        },
        popup_2: {
          entry: { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[4] } },
          on: {
            NEXT_POPUP: 'create_and_attach_policies',
          },
        },
        create_and_attach_policies: {
          entry: [
            'hide_popups',
            { type: 'show_popover_message', params: { message: POPOVER_TUTORIAL_MESSAGES[4] } },
            {
              type: 'append_creation_objectives',
              params: { objectives: POLICY_CREATION_OBJECTIVES[1] },
            },
            {
              type: 'set_edge_connection_objectives',
              params: { objectives: EDGE_CONNECTION_OBJECTIVES[0] },
            },
          ],
          type: 'parallel',
          onDone: 'policies_and_edges_created',
          states: {
            create_s3_read_write_policy: {
              initial: 'creation_in_progress',
              states: {
                creation_in_progress: {
                  on: {
                    [NodeCreationFinishEvent.S3_READ_WRITE_POLICY_CREATED]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.S3_READ_WRITE_POLICY_CONNECTED]: {
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.FrontendTeamS3BucketAccess },
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
            create_dynamo_read_write_policy: {
              initial: 'creation_in_progress',
              states: {
                creation_in_progress: {
                  on: {
                    [NodeCreationFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CREATED]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CONNECTED]: {
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.BackendTeamDynamoDBAccess },
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
            create_cloudfront_invalidation_policy: {
              initial: 'creation_in_progress',
              states: {
                creation_in_progress: {
                  on: {
                    [NodeCreationFinishEvent.CF_DISTRIBUTION_INVALIDATION_POLICY_CREATED]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.CLOUDFRONT_INVALIDATION_POLICY_CONNECTED]: {
                      actions: [
                        {
                          type: 'finish_level_objective',
                          params: { id: LevelObjectiveID.FrontendTeamCloudFrontAccess },
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
          },
        },
        policies_and_edges_created: {
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
          type: 'final',
          entry: [
            'store_checkpoint',
            'hide_unnecessary_edges_or_nodes_warning',
            { type: 'show_popup_message', params: { message: POPUP_TUTORIAL_MESSAGES[5] } },
          ],
        },
      },
    },
  },
});
