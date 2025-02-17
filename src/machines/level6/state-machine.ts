import { assign } from 'xstate';

import { INITIAL_IN_LEVEL_NODES } from './nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { LEVEL_OBJECTIVES } from './objectives/level-objectives';
import { POLICY_CREATION_OBJECTIVES } from './objectives/policy-creation-objectives';
import { ROLE_CREATION_OBJECTIVES } from './objectives/role-creation-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import {
  EdgeConnectionFinishEvent,
  FinishEventMap,
  PolicyCreationFinishEvent,
  RoleCreationFinishEvent,
} from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  POLICY_CREATION_OBJECTIVES,
  ROLE_CREATION_OBJECTIVES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBswDczIGwH1YBcBDfMHAW0IGMALASwDswBiAQQBE2cBJFgWRwAKAeQAyXAMIBNHADkhbAKIBtAAwBdRKAAOAe1i18tHfU0gAHogCcAVksA6a9YAsAdgDMARiwAmJ1g9uLgA0IACeiFgAHC52Hi5xTt5xkR4e1i4AvhkhqBjYeEQk5FR0jKwcOApsAOLK6qa6+obGphYIHioddiqR3iou8S4q3pEq1iHhCLYqdvGRWG7+1t5YQ1hZOeiYuATEpBQ0DMwAygoAKrLyCseqGkggjQZGJvdtHSpYsSqWie4ekdY3G5IhNEE4fnYVo43J1vC5vN5HBsQLltgU9sVDmVThcqrUbvV7o9mi9QG8VP1If4XFhLF5-G4fqCEIyYilfL4OskVE5kaj8rsigdSicABJCADqgiEwgAagoAEq3Bp6J4tV5WeazdLzLyRSKuYHMmEeOxuWyeUY0oGAvlbAWFfYlI5MUVcRTSuWKgl3bSqkmtTUxSxAhaWeJYYbfZl9Jx2SwfJJ9aw9BPeO15HaOzEiphnITVaoiBQ4Y7uksCFgyBQiZVE-3PQMIcOmjyWSwrBEw6z+ZkdSJ2JyAjqRxFOIceDNowVOrHMFhnM4scSi6ViKQ4fOVGRnLhnSR1v1NRsa5tONyzDqWAGrdxYJwgsKIDzp7Io+1ZjHCo52Bj6CCkPydj4AArvgOgAE60IQyA4LoWggVoHhMNWAAaFzCAIACqAiHg8DbqmSiBwtYdi9Cobh9OG-Twn4fYdKRPgPlgjgBEkkRTg6X7Oowv70P+gH2sBYGQdBsHwYh3goQo6GejheHEieREINEfbuDEqxxOxjhwq4nGfkKPFgHxAk4EBYD0IYhhwDglAQWAxDPEwEDGMZM52PyBmziKJm0ABZlCRZVm0DZdkOSSCkEaS5iIKM3gOEMQJDOeWnBE+7QDIxvgAi4ji0pl+nooZc6+f5QFaPZWiEPZODQWQOAgbAYAQTg4E4IQsCwCBZCkBBOioLV9A4ABBAMI5xjOa5djuZ5RXeT+f5+YJeR2BVYBVTVdUNU1LVtR1XU9TgfUDQww1wIY9DjfQkXHoRMXtM4A6Ub0L5YPe3jtk4am5XYTE5Xl4a5Vkb70DoI2mLNM45kcKq3dFbQALRtsyuXxX9D59OakYcW+kPZt+vGLWV9qw2q8PEZYzIGjML6uAmURpEObiFVDBPGUTy2YMJ4FQTBcE6AhSGkwGp4DH2PRo9lTg9CkPbDCz+NGaVnPINzol8xJWjeMLSn3eeMRjK4wxvT8LgpOLvS-VLMtpKOCvcSVHMBStQVPKF9lXTrd1tAi9jWACPxuIkIwseGfbmhetPzIEE73tY9vFT5TvmZZbuwLZHsknYYUYhAoSXWQYMAEZHQ5ED88gtCUJMR5k02cIxP7tjnsH8y2GlkxxJRVsPtL160mMr6bJmc3Q4T-FLc7XOu9Z6c51n8+kHnBfF6XhDl7olfV9nmdL-nhCFxAJcexv-VV6Eg1wX1UD2Z1XvkyyiIOAHLcIm3Yfpf8fSxNlSYsf8Cd5rj1MinYK7twrPB3uFPeK8j5r1PlvUI2cdBkC0KgEgEB75NkSJ8Q2tIERpECFCPs0QBx-Uom9dI-tMi4w-KPNmysp6qxniFOemdIGLyOv1UgAAzSCtUD7bWalg08Ddn7NyDm-UOHdnw2FNOjf4-g0g42HtORWjsJ7ExdqnWeGcIHGCgRiY6vD+FbUas1QxRRjE4D4S1MxO1L4VR0DfOA8B6xwybJRUiTdA6t2kTGCi9go4EMZOeEYgCx7s00SrOwLDwFXUsb1bhNjTGCPMRBZBqD0GQBEcpaWnxUjPQ8Pk6wbZIhuACeGHu5TzTS1hBEhhydAo6NYXohJnCtqb3Piklq+1uoMCgFw1AuT7piJ8a-EO7c+ylIvH9AYdIPqJBUe+EerMlZNO0WAth+j6CJIEfVLp1centU6v0+ggzjF7M6WfI5tiTkHQGUM0gp0nEuLvu4uup4vHiN8VIqZn9Iytmyv7NsL44jx1oas9RSdolMNiS0+JC9d77Irt0u5fSyCPMuZQFBaCwAYJGW0IcMxgSrD6AEFM4Yex9lDtUzwLg6QpgWA09ZsLyqVWqs8tJDi9qnMOtY06I0Lqew+SLZS+pTTeCDtLPoZthhpD7K4LKD4ezgkBAaZZeMHYwpAUJNaG0uX1XSa1HQ9zupJJOkNIVY0F7GEYJQfAw196H2PmXVFRy2r2Oak8wlVgPqQmlVGOVSRxgAq6FHDGiwogQtUVxROC02V6o5Ztbl3reUHQtc8q150bUcLtWAB1TrYGuvXu6i+nrU0tWxfmwty8D6rxPmWk1KLjUCqGq82+bja5ivuoDAN44g1xQVQCqpf0RilLVeGFlGjdUrX1ZyltPLTUYszZfa1l1bX0HtY6utLr4FNorUahx1asn4pyaK3Wbxin2FTPqeE7gpWqU-rlAp2VGSMvVesSFajtUJtnVzedKaj1puXXy1dgqc0brzVugtjqV1PIPaar1EFfXNn9VKgdsqh2hs7r0IJUs6RXkCDQ2NXlImMPZetBdyHm3wbbWdUaUGDE4pg4WujyTDnlqQ5W5BrG4NgYQ5x5tNGXnX07ahvtGGZX9Gw32Oknwx0hkiB2Wm06dWT0owaxdIGzX8uSRBxj7Sa38YzYJm5XHtMZJxaeglF7vbPlSAOD6A9il+Bke0KlP9e4yfDHSZm3641AKif+1WLHt0MeFSSBDbVRJQFzecyzqH6TxXbAiAYtI6QY2+nGP6b0B3FPNGpv9GmhL8hsQwWgsBqDnu7ZexAYt0rhhy8CuKkiv1ZCAA */
  id: 'level6_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'IAM Roles',
    level_description: 'IAM Roles',
    level_number: 6,
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
    use_multi_account_canvas: true,
    side_panel_open: false,
    fixed_popover_messages: [],
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
          params: ({ event }) => ({
            docString: event.doc_string,
            accountId: event.account_id,
            label: event.label,
          }),
        },
      ],
    },
    [StatefulStateMachineEvent.AttachRoleToEntity]: {
      actions: [
        {
          type: 'attach_role_to_entity',
          params: ({ event }) => ({
            roleNode: event.sourceNode,
            targetNode: event.targetNode,
          }),
        },
      ],
    },
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
    TOGGLE_SIDE_PANEL: {
      actions: assign({
        side_panel_open: ({ context }) => !context.side_panel_open,
      }),
    },
    ATTACH_POLICY_TO_ENTITY: {
      actions: [
        {
          type: 'attach_policy_to_entity',
          params: ({ event }) => ({ policyNode: event.sourceNode, entityNode: event.targetNode }),
        },
      ],
    },
  },
  states: {
    inside_level: {
      initial: 'tutorial_popup1',
      entry: assign({
        nodes: INITIAL_IN_LEVEL_NODES,
        level_objectives: LEVEL_OBJECTIVES[0],
      }),
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
            NEXT_POPUP: {
              actions: ['hide_popups', 'show_side_panel'],
              target: 'entities_creation',
            },
          },
        },
        entities_creation: {
          entry: [
            'next_policy_creation_objectives',
            'next_role_creation_objectives',
            'show_side_panel',
          ],
          type: 'parallel',
          onDone: 'prepare_iam_user_to_assume_role_in_destination',
          states: {
            create_dynamodb_read_policy: {
              initial: 'create_dynamodb_read_policy_in_progress',
              states: {
                create_dynamodb_read_policy_in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.DYNAMODB_READ_POLICY_CREATED]: 'completed',
                  },
                },
                completed: {
                  entry: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.CREATE_DESTINATION_POLICY },
                    },
                  ],
                  type: 'final',
                },
              },
            },
            create_role_for_iam_user: {
              initial: 'create_role_for_iam_user_in_progress',
              states: {
                create_role_for_iam_user_in_progress: {
                  on: {
                    [RoleCreationFinishEvent.DYNAMODB_READ_ROLE_CREATED]: 'completed',
                  },
                },
                completed: {
                  entry: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.CREATE_IAM_USER_ROLE },
                    },
                  ],
                  type: 'final',
                },
              },
            },
            create_iam_policy_for_assuming_role: {
              initial: 'create_iam_policy_for_assuming_role_in_progress',
              states: {
                create_iam_policy_for_assuming_role_in_progress: {
                  on: {
                    [PolicyCreationFinishEvent.ASSUME_ROLE_POLICY_CREATED]: 'completed',
                  },
                },
                completed: {
                  entry: [
                    {
                      type: 'finish_level_objective',
                      params: { id: LevelObjectiveID.CREATE_IAM_POLICY_FOR_ASSUMING_ROLE },
                    },
                  ],
                  type: 'final',
                },
              },
            },
          },
        },
        prepare_iam_user_to_assume_role_in_destination: {
          type: 'parallel',
          onDone: 'connect_destination_role_to_originating_iam_user',
          entry: 'next_edge_connection_objectives',
          states: {
            connect_dynamodb_read_policy_to_iam_user_role: {
              initial: 'connect_dynamodb_read_policy_to_iam_user_role_in_progress',
              states: {
                connect_dynamodb_read_policy_to_iam_user_role_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.DYNAMODB_READ_POLICY_ATTACHED_TO_READ_ROLE]:
                      'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
            connect_assume_role_policy_to_iam_user: {
              initial: 'connect_assume_role_policy_to_iam_user_in_progress',
              states: {
                connect_assume_role_policy_to_iam_user_in_progress: {
                  on: {
                    [EdgeConnectionFinishEvent.ASSUME_ROLE_POLICY_ATTACHED_TO_IAM_USER]:
                      'completed',
                  },
                },
                completed: {
                  type: 'final',
                },
              },
            },
          },
        },
        // TODO: Connecting should happen from the originating account to the destination account
        // Not the other way around
        connect_destination_role_to_originating_iam_user: {
          entry: 'next_edge_connection_objectives',
          on: {
            [EdgeConnectionFinishEvent.DYNANODB_READ_ROLE_ATTACHED_TO_IAM_USER]: {
              target: 'level_finished',
              actions: {
                type: 'finish_level_objective',
                params: { id: LevelObjectiveID.GRANT_READ_ACCESS_TO_THIRD_PARTY_USER },
              },
            },
          },
        },
        level_finished: {
          type: 'final',
          entry: 'next_popover',
        },
      },
    },
  },
});
