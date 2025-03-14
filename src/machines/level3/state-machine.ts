import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { INITIAL_TUTORIAL_POLICY_NODES } from './nodes/policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from './nodes/resource-nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-role-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  NodeCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { resolveInitialEdges } from '../utils/initial-edges-resolver';
import { ElementID } from '@/config/element-ids';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  POLICY_CREATION_OBJECTIVES,
  [],
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level3_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Customer Managed Policies',
    level_description: 'Customer managed policies!',
    level_number: 1,
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
    policy_edit_objectives: [],
    edges_connection_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
  },
  on: {
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ nodeType: event.node_entity, params: event.node_data }),
        },
      ],
    },
    ADD_IAM_POLICY_NODE: {
      actions: [
        {
          type: 'add_policy_node',
          params: ({ event }) => ({ docString: event.doc_string, label: event.label }),
        },
      ],
    },
    ADD_EDGE: {
      actions: [
        assign({
          edges: ({ context, event }) => [...context.edges, event.edge],
        }),
      ],
    },
    DELETE_EDGE: {
      actions: [
        assign({
          edges: ({ context, event }) => context.edges.filter(edge => edge.id !== event.edge.id),
        }),
      ],
    },
    SET_NODES: {
      actions: assign({
        nodes: ({ event }) => event.nodes,
      }),
    },
    SET_EDGES: {
      actions: assign({
        edges: ({ event }) => event.edges,
      }),
    },
    SHOW_POPOVER: {
      actions: assign({
        popover_content: ({ event }) => event.popover_content,
        show_popovers: true,
      }),
    },
    HIDE_POPOVERS: { actions: 'hide_popovers' },
    HIDE_FIXED_POPOVERS: { actions: 'hide_fixed_popovers' },
    NEXT_FIXED_POPOVER: { actions: 'next_fixed_popover' },
    TOGGLE_SIDE_PANEL: {
      actions: assign({
        side_panel_open: ({ context }) => !context.side_panel_open,
      }),
    },
    [StatefulStateMachineEvent.ConnectNodes]: {
      actions: [
        {
          type: 'connect_nodes',
          params: ({ event }) => ({ sourceNode: event.sourceNode, targetNode: event.targetNode }),
        },
      ],
    },
  },
  states: {
    inside_tutorial: {
      initial: 'tutorial_popup1',
      onDone: 'inside_level',
      entry: [
        assign({
          nodes: INITIAL_TUTORIAL_POLICY_NODES,
          level_objectives: LEVEL_OBJECTIVES[0],
        }),
        'enable_tutorial_state',
      ],
      states: {
        tutorial_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popup2',
          },
        },
        tutorial_popup2: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popup3',
          },
        },
        tutorial_popup3: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'aws_managed_policy_popover',
          },
        },
        aws_managed_policy_popover: {
          entry: [
            'next_popover',
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [ElementID.IAMNodeContentButton],
              },
            },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentOpened]: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: [
            'hide_popovers',
            'show_fixed_popover',
            {
              type: 'update_red_dot_visibility',
              params: {
                elementIds: [ElementID.IAMNodeContentCloseButton],
                isVisible: true,
              },
            },
          ],
          on: {
            [StatelessStateMachineEvent.IAMNodeContentClosed]: 'fixed_popover2',
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
            NEXT_FIXED_POPOVER: 'fixed_popover4',
          },
        },
        fixed_popover4: {
          entry: 'next_fixed_popover',
          on: {
            NEXT_FIXED_POPOVER: 's3_bucket_popover',
          },
        },
        s3_bucket_popover: {
          entry: [
            'hide_fixed_popovers',
            'next_popover',
            assign({
              nodes: [...INITIAL_TUTORIAL_POLICY_NODES, ...INITIAL_TUTORIAL_RESOURCE_NODES],
            }),
          ],
          on: {
            IAM_NODE_ARN_OPENED: 'copy_arn',
          },
        },
        copy_arn: {
          entry: 'hide_popovers',
          on: {
            IAM_NODE_ARN_COPIED: 'create_your_custom_policy_popover',
          },
        },
        create_your_custom_policy_popover: {
          entry: [
            'hide_fixed_popovers',
            'next_popover',
            'next_policy_creation_objectives',
            'show_side_panel',
            {
              type: 'update_whitelisted_element_ids',
              params: {
                whitelisted_element_ids: [
                  ElementID.NewEntityBtn,
                  ElementID.CreateRolesAndPoliciesMenuItem,
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
          entry: 'next_popover',
          exit: 'hide_popovers',
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
      initial: 'popup1',
      entry: [
        { type: 'add_new_level_objective', params: { objectives: LEVEL_OBJECTIVES[1] } },
        'disable_tutorial_state',
        'show_side_panel',
        assign({
          edges: resolveInitialEdges(INITIAL_IN_LEVEL_NODES),
          nodes: INITIAL_IN_LEVEL_NODES,
        }),
      ],
      states: {
        popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'popup2',
          },
        },
        popup2: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'create_and_attach_policies',
          },
        },
        create_and_attach_policies: {
          entry: [
            'hide_popups',
            'next_popover',
            'next_policy_creation_objectives',
            'next_edge_connection_objectives',
          ],
          type: 'parallel',
          onDone: 'create_and_attach_policies_completed',
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
            create_cloudfront_read_policy: {
              initial: 'creation_in_progress',
              states: {
                creation_in_progress: {
                  on: {
                    [NodeCreationFinishEvent.CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED]:
                      'attachment_in_progress',
                  },
                },
                attachment_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.CLOUDFRONT_READ_POLICY_CONNECTED]: {
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
        create_and_attach_policies_completed: {
          type: 'final',
          entry: 'next_popup',
        },
      },
    },
  },
});
