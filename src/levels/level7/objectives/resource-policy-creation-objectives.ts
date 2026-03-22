import { ValidateFunctionsFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, ResourcePolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, ResourceNodeID, ResourcePolicyNodeID } from '../types/node-ids';
import { MANAGED_POLICIES } from '@/domain/managed-policies';
import { createResourcePolicyCreationObjective } from '@/levels/utils/factories/resource-policy-creation-objective-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMResourcePolicyCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE1_CALLOUT_MSG = `
  The \`Principal\` uses the same formats as in role trust policies:

  \`{ "AWS": "<user_arn>" }\` for an IAM user principal

  \`{ "Service": "<service-name>.amazonaws.com" }\` for an AWS service principal.
`;

const OBJECTIVE2_CALLOUT_MSG = `
  Create an resource-based policy that grants the user \`alex\`
  read/write access to the S3 bucket \`rpd-case-files\`
`;

const OBJECTIVE1_HINT_MSG1 = `
  Remember: permissions are granted to objects inside the bucket.
`;

const OBJECTIVE1_HINT_MSG2 = `
  Use \`arn:aws:s3:::your_bucket_name/*\`
  to target all objects inside the bucket.
`;

const OBJECTIVE2_HINT_MSG3 = `
  This resource-policy is quite similar to the identity-based policy you created earlier,
  but it needs a \`Principal\` field to specify who is granted access to the resource.
`;

export const RESOURCE_POLICY_CREATION_OBJECTIVES: IAMResourcePolicyCreationObjective<
  FinishEventMap,
  ValidateFunctionsFnName
>[][] = [
  [
    {
      id: 'resource-policy-1',
      type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.ResourcePolicy,
      on_finish_event: ResourcePolicyCreationFinishEvent.TUTORIAL_RESOURCE_BASED_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.S3_READ_RESOURCE_BASED_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      initial_edges: [
        {
          from: ResourcePolicyNodeID.TutorialResourceBasedPolicy,
          to: ResourceNodeID.TutorialS3Bucket,
        },
      ],
      extra_data: {
        resource_node_id: ResourceNodeID.TutorialS3Bucket,
        granted_accesses: [
          {
            target_node: ResourceNodeID.TutorialS3Bucket,
            target_handle: 'right',
            source_handle: 'left',
            access_level: AccessLevel.Read,
          },
        ],
      },
      help_badges: [
        {
          path: '/Statement/0/Resource',
          content: 'The resource the policy is applied to',
          color: 'yellow',
        },
        {
          path: '/Statement/0/Principal',
          content: 'The Principal which is allowed/denied access to the resource',
          color: 'yellow',
        },
      ],
      hint_messages: [
        {
          title: 'Hint #1',
          content: OBJECTIVE1_HINT_MSG1,
        },
        {
          title: 'Hint #2',
          content: OBJECTIVE1_HINT_MSG2,
        },
      ],
    } satisfies Partial<
      IAMResourcePolicyCreationObjective<FinishEventMap, ValidateFunctionsFnName>
    >,
  ].map(objective => createResourcePolicyCreationObjective(objective)),
  [
    {
      id: 'resource-policy-2',
      type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.ResourcePolicy,
      on_finish_event: ResourcePolicyCreationFinishEvent.IN_LEVEL_RESOURCE_BASED_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      account_id: AccountID.TrustingAccount,
      created_node_parent_id: AccountID.TrustingAccount,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      initial_edges: [
        {
          from: ResourcePolicyNodeID.InsideLevelResourceBasedPolicy,
          to: ResourceNodeID.InsideLevelS3Bucket,
        },
      ],
      callout_message: OBJECTIVE2_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Hint',
          content: OBJECTIVE2_HINT_MSG3,
        },
      ],
      extra_data: {
        resource_node_id: ResourceNodeID.InsideLevelS3Bucket,
        granted_accesses: [
          {
            target_node: ResourceNodeID.InsideLevelS3Bucket,
            target_handle: 'right',
            source_handle: 'left',
            access_level: AccessLevel.Read,
          },
        ],
      },
    } satisfies Partial<
      IAMResourcePolicyCreationObjective<FinishEventMap, ValidateFunctionsFnName>
    >,
  ].map(objective => createResourcePolicyCreationObjective(objective)),
];
