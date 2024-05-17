import { Edge } from 'reactflow';
import { setup, assign } from 'xstate';

import { TUTORIAL_MESSAGES } from './config';
import { nodes, edges } from './nodes';
import type { Context, InsideLevelMetadata, InsideTutorialMetadata, EventData } from '../types';

export const stateMachine = setup({
  types: {} as {
    context: Context;
    events: EventData;
    meta: InsideLevelMetadata | InsideTutorialMetadata;
  },
  actions: {
    next_popover: assign({
      active_popover_index: ({ context }) =>
        (context.active_popover_index + 1) % context.popovers_sequence_ids.length,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBswDczIIwH1YBcBDfMHAW0IGMALASwDswA6B2WiU-AV3wHsAnWoWQBiCL0ZMCxZqgzY8REuSp1Jrdpx4ChyANoAGALqJQAB15t8tCaZAAPRFgBMAFgNMAnADYsBgOwArP5uAMwAHFihADQgAJ6IoVhYTM7+oa6BBs6hnqEGnp7+AL7FsXKYuNLKFDQMzBocONx8gsJMFhYY-FgiAHIAogAaACo4AAoA8lMAagMASoYmSCAWVjb0do4IWHlMyf67Bgbh7rlusQkIoYHOTLcZ3oGh3oWRWKXl6JWKMip16nobCaLR07U6vG6zn6wzGU1mCyWdjWtGsthW21cRSY-gMoWcx2O4U8xM8rkuiVu9xyrieLzeyU+IAqCmqpFqagaQM0zW0bWQHV4XTA-FCMNGE2mkzmi2MyMsqI2W0Q4WyONcOQM7nSePCFOuVIetOerxJjLKzO+rKU7NU9RY3KaLLEEmYbKYLKqNv+nIdwNILKRKxRaM2GMQBIi1JugVc-n8rxj+tCGVSWQMWG8+OcObSoSZnt+NTtgP9OBZTEoEkYlHwOCEZBwFmQtEocWavBwXFgIodTf4vCg-DgsBEAEkAIIAWUlABkxwBhACaOAXkz6gwXIwGABEg+YFaHlTtArGmOFnBfvJeMv48jF4oksIFUliSZ5nJmsJEcgWrV6-g5e1GgDK1K2HP4Gy7Ht+D7MwByHEdx2nHAAFUAGUFlXeYBgnbc9zlYNDyVcMTzPC8rxvON731OMX0KBiCW8J571cUoLXoXgOHgFZCzZH16nldZ0VAbYAFoLkfBAxI1P95AA4sAS5MtQX5ITFREhwI3JKTP3CJhsgyQJv0iF5wlCEoLT470gNLHlVN0QVhR6dSj1IkJkwTAzCQKW4jjJOSfn42zlPsvlHIhKFXJI0TEn8VwmDjZjjmSLEMmcTzvG8wlPD8zwCjYqz-yLW0lL9MLWgioVIRFUJos07ZvDvAzr18Y5cnCU49Skiysp854IgifxzMsr55JKgS7JBcL2gc4QcCrMgzFQEgIHqsNYoQEkEr8LBDlcPxcnxTxPISoJ2uSJJIwMbxAutQCS1Cp0rXW48ol2Jhr2MzMCXcSJ9Q-e5CSiVxOt8NJAjuhTSt9EDyzAqt6BrOsoObVt2z4aCRVe0ioiaz7nG+68tROLB9RzfxsuOLJaTcQ6oYmkLyue+RK2rMBa3rQhGzRtsOyx2CGH7Qdh1gHiD2EjatJ2A6Xy+5Jib+smeufdU3g-L8f3zIrxuCx7mdA1nEeRrmed4Fs+cx7te0W5awFWnHNu-ZJ9m1QISW8PFhv8ZMsAS9MMxOQm4yxBm9bKuGK0oCDlCg63+Ed6W8cp+WfpJ-6evCSnzuOYafDpKIw5s-XI4RmPSDjmC4IQ0XxdWYiGqcWWCaJ37Sdory30KJiWJTQqxqC4uI8dQ3MHAsBIO5gW2aWlbIET7Y9u8fSKMJzr3BObwdKuOi0xSl4gk60bLV1offRZBbeFn+356IyXj2CfU70pgO-Hi3Eng+digA */
  id: 'level1_state_machine',
  initial: 'inside_level',
  context: {
    level_title: 'IAM Basics',
    level_description: 'Learn about Identity and Access Management',
    level_number: 1,
    popovers_sequence_ids: ['iam_policy1', 'iam_user1', 'iam_resource1'],
    active_popover_index: 0,
    state_name: 'inside_tutorial',
    inside_tutorial: true,
    nodes: nodes,
    metadata_keys: {},
    // target_meta_keys: {}
  },
  entry: assign({
    nodes: nodes,
  }),
  states: {
    inside_tutorial: {
      initial: 'popover1',
      entry: assign({
        state_name: 'inside_tutorial',
      }),
      onDone: {
        actions: assign({ state_name: 'in_game' }),
        target: 'inside_level',
      },
      states: {
        popover1: {
          meta: TUTORIAL_MESSAGES[0],
          on: {
            NEXT_POPOVER: {
              target: 'popover2',
              actions: 'next_popover',
            },
          },
        },
        popover2: {
          meta: TUTORIAL_MESSAGES[1],
          on: {
            NEXT_POPOVER: {
              target: 'popover3',
              actions: 'next_popover',
            },
          },
        },
        popover3: {
          meta: TUTORIAL_MESSAGES[2],
          on: {
            NEXT_POPOVER: {
              actions: 'next_popover',
              target: 'tutorial_completed',
            },
          },
        },
        tutorial_completed: {
          type: 'final',
        },
      },
    },
    inside_level: {
      type: 'parallel',
      onDone: 'level_completed',
      entry: assign({
        inside_tutorial: false,
        state_name: 'inside_level',
        metadata_keys: {
          'level1_state_machine.inside_level.connect_iam_policy_to_user.in_progress':
            'IAM_POLICY_CONNECTED',
        },
      }),
      states: {
        connect_iam_policy_to_user: {
          initial: 'in_progress',
          states: {
            in_progress: {
              meta: {
                connection_targets: [
                  {
                    required_edges: [edges['e-iam_policy1-iam_user1']],
                    locked_edges: [edges['e-iam_user1-iam_resource1']],
                  },
                ],
              },
              on: {
                IAM_POLICY_CONNECTED: {
                  target: 'completed',
                },
              },
            },
            completed: {
              type: 'final',
            },
          },
        },
        // create_iam_user: {
        //   initial: 'in_progress',
        //   meta: {
        //     connection_targets: [
        //       {
        //         required_edges: [edges['e-iam_policy1-iam_user1']],
        //         locked_edges: [edges['e-iam_user1-iam_resource1']],
        //       },
        //     ],
        //   },
        //   states: {
        //     in_progress: {
        //       on: {
        //         IAM_USER_CREATED: {
        //           target: 'completed',
        //         },
        //       },
        //     },
        //     completed: {
        //       type: 'final',
        //     },
        //   },
        // },
      },
    },
    level_completed: {
      type: 'final',
    },
  },
});
