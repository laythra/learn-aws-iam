import { ValidateFunctionsFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, NodeCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/levels/types/objective-types';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

const CALLOUT_MESSAGE1 = `
  We can grant read access to objects within an S3 bucket using wildcards.
  Such as \`arn:aws:s3:::your_bucket_name/*\`
`;

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<
  FinishEventMap,
  ValidateFunctionsFnName
>[][] = [
  [
    {
      id: PolicyNodeID.S3ReadPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
      initial_code: INITIAL_POLICIES.S3ReadAccess,
      callout_message: CALLOUT_MESSAGE1,
      on_finish_event: NodeCreationFinishEvent.S3_READ_POLICY_CREATED,
      extra_data: {
        granted_accesses: [],
      },
      help_badges: [
        {
          path: '/Statement/0/Effect',
          content: 'Allows the specified actions on the target resources',
          color: 'green',
        },
        {
          path: '/Statement/0/Action/0',
          content: 'Allows reading objects from s3 buckets',
          color: 'green',
        },
        {
          path: '/Statement/0/Resource',
          content: 'Target resources to apply the policy',
          color: 'yellow',
        },
      ],
      limit_new_lines: true,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap, ValidateFunctionsFnName>>,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.S3ReadWritePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      on_finish_event: NodeCreationFinishEvent.S3_READ_WRITE_POLICY_CREATED,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.PublicAssetsS3Bucket,
            access_level: AccessLevel.ReadWrite,
            target_handle: 'bottom',
            source_handle: 'top',
          },
        ],
      },
      layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap, ValidateFunctionsFnName>>,
    {
      id: PolicyNodeID.CloudFrontReadPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      on_finish_event: NodeCreationFinishEvent.CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.CloudFront,
            access_level: AccessLevel.Read,
            target_handle: 'bottom',
            source_handle: 'top',
          },
        ],
      },
      layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap, ValidateFunctionsFnName>>,
    {
      id: PolicyNodeID.DynamoDBReadWritePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      on_finish_event: NodeCreationFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CREATED,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.DynamoDBTable,
            access_level: AccessLevel.Read,
            target_handle: 'bottom',
            source_handle: 'top',
          },
        ],
      },
      layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap, ValidateFunctionsFnName>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
