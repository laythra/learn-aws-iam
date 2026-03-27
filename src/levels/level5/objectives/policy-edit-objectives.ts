import { ValidateFunctionsFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID } from '../types/node-ids';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMPolicyEditObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE1_HINT_MSG1 = `
  This Identity-based Policy is missing the ARN of the new role that you created
`;

export const POLICY_EDIT_OBJECTIVES: IAMPolicyEditObjective<
  FinishEventMap,
  ValidateFunctionsFnName
>[][] = [
  [
    {
      id: PolicyNodeID.AssumeRolePolicy,
      validate_fn_name: PolicyNodeID.AssumeRolePolicy,
      type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyEditFinishEvent.TUTORIAL_POLICY_EDITED,
      resources_to_grant: [],
      hint_messages: [
        {
          title: 'Level Objective',
          content: OBJECTIVE1_HINT_MSG1,
        },
      ],
      finished: false,
    },
  ],
];
