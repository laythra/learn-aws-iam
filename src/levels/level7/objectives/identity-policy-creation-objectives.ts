import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, PolicyNodeID } from '../types/node-ids';
import { MANAGED_POLICIES } from '@/domain/managed-policies';
import { createPolicyCreationObjective } from '@/levels/utils/factories/identity-policy-creation-objective-factory';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMIdentityPolicyCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE_MESSAGE1 = `
  Create an **Identity-Based Policy** that grants the user \`alex\`
  read/write access to the S3 bucket \`incident-response-artifacts\`
`;

const HINT_MESSAGE1 = `
  The permissions required to allow read/write access to the S3 bucket are:
  * \`s3:GetObject\` - allows reading objects from the bucket
  * \`s3:PutObject\` - allows writing objects to the bucket
`;

export const POLICY_CREATION_OBJECTIVES: IAMIdentityPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      account_id: AccountID.TrustedAccount,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
      hint_messages: [
        {
          title: 'Objective',
          content: OBJECTIVE_MESSAGE1,
        },
        {
          title: 'Hint',
          content: HINT_MESSAGE1,
        },
      ],
      extra_data: {
        granted_accesses: [],
      },
    } satisfies Partial<IAMIdentityPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
