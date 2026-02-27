import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, PolicyNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import {
  IAMPermissionPolicyCreationObjective,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

const CALLOUT_MESSAGE1 = `
  Create an identity-based policy that grants the user read/write access to the S3 bucket
  \`rpd-case-files\`
`;

const HINT_MESSAGE1 = `
  The permissions required to allow read/write access to the S3 bucket are:
  * \`s3:GetObject\` - allows reading objects from the bucket
  * \`s3:PutObject\` - allows writing objects to the bucket
`;

export const POLICY_CREATION_OBJECTIVES: IAMPermissionPolicyCreationObjective<FinishEventMap>[][] =
  [
    [
      {
        id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
        type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
        entity: IAMNodeEntity.Policy,
        on_finish_event: PolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED,
        initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
        account_id: AccountID.TrustedAccount,
        limit_new_lines: false,
        layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
        hint_messages: [
          {
            title: 'Hint',
            content: HINT_MESSAGE1,
          },
        ],
        extra_data: {
          granted_accesses: [],
        },
        callout_message: CALLOUT_MESSAGE1,
      } satisfies Partial<IAMPermissionPolicyCreationObjective<FinishEventMap>>,
    ].map(objective => createPolicyCreationObjective(objective)),
  ];
