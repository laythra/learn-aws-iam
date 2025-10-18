import { FinishEventMap } from '../types/finish-event-enums';
import { IAMPolicyEditObjective } from '@/machines/types';

export const POLICY_EDIT_OBJECTIVES: IAMPolicyEditObjective<FinishEventMap>[][] = [
  // [
  //   {
  //     type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
  //     entity: IAMNodeEntity.Policy,
  //     callout_message: OBJECTIVE1_CALLOUT_MSG,
  //     on_finish_event: PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_FIRST_TIME,
  //     resources_to_grant: [],
  //     hint_messages: [
  //       {
  //         title: 'Condition Operators',
  //         content: OBJECTIVE1_HINT_MSG1,
  //       },
  //       {
  //         title: 'Condition Keys',
  //         content: OBJECTIVE1_HINT_MSG2,
  //       },
  //       {
  //         title: 'Condition Values',
  //         content: OBJECTIVE1_HINT_MSG3,
  //       },
  //     ],
  //     help_badges: [
  //       {
  //         path: 'Statement[1].Condition',
  //         content: 'Condition element to restrict access to seniors',
  //         color: 'yellow',
  //       },
  //     ],
  //   },
  // ],
  // [
  //   {
  //     type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
  //     entity: IAMNodeEntity.Policy,
  //     on_finish_event: PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_SECOND_TIME,
  //     resources_to_grant: [],
  //     hint_messages: [
  //       {
  //         title: 'Condition Operator',
  //         content: OBJECTIVE2_HINT_MSG1,
  //       },
  //       {
  //         title: 'Condition Keys for Tags',
  //         content: OBJECTIVE2_HINT_MSG2,
  //       },
  //     ],
  //   },
  // ],
];
