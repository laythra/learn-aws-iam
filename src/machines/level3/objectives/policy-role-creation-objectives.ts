import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import cloudfrontReadPolicySchema from '../schemas/policy/cloudfront-read-policy-schema.json';
import dynamoReadWritePolicySchema from '../schemas/policy/dynamo-db-read-write-policy-schema.json';
import s3ReadPolicySchema from '../schemas/policy/s3-read-policy-schema.json';
import s3ReadWritePolicySchema from '../schemas/policy/s3-read-write-policy-schema.json';
import { FinishEventMap, NodeCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const CALLOUT_MESSAGE1 = `
  We can grant read access to objects within an S3 bucket using wildcards.
  Such as \`arn:aws:s3:::your_bucket_name/*\`
`;

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.S3ReadWriteAcces,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadPolicySchema,
      created_node_initial_position: 'top-left',
      initial_code: INITIAL_POLICIES.S3ReadAccess,
      callout_message: CALLOUT_MESSAGE1,
      on_finish_event: NodeCreationFinishEvent.S3_READ_POLICY_CREATED,
      validate_inside_code_editor: true,
      granted_accesses: [],
      validate_function: AJV_COMPILER.compile(s3ReadPolicySchema),
      help_badges: [
        {
          path: 'Statement[0].Effect',
          content: 'Allows the specified actions on the target resources',
          color: 'green',
        },
        {
          path: 'Statement[0].Action[0]',
          content: 'Allows reading objects from s3 buckets',
          color: 'green',
        },
        {
          path: 'Statement[0].Resource',
          content: 'Target resources to apply the policy',
          color: 'yellow',
        },
      ],
      limit_new_lines: true,
    },
  ],
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.S3ReadWriteAcces,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWritePolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: NodeCreationFinishEvent.S3_READ_WRITE_POLICY_CREATED,
      validate_inside_code_editor: false,
      granted_accesses: [
        {
          target_node: ResourceNodeID.PublicImagesS3Bucket,
          access_level: AccessLevel.ReadWrite,
          target_handle: 'bottom',
        },
      ],
      validate_function: AJV_COMPILER.compile(s3ReadWritePolicySchema),
    },
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.CloudfrontReadAccess,
      entity: IAMNodeEntity.Policy,
      json_schema: cloudfrontReadPolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: NodeCreationFinishEvent.CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED,
      validate_inside_code_editor: false,
      granted_accesses: [
        {
          target_node: ResourceNodeID.CloudFront,
          access_level: AccessLevel.Read,
          target_handle: 'bottom',
        },
      ],
      validate_function: AJV_COMPILER.compile(cloudfrontReadPolicySchema),
    },
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.DynamoDBReadWriteAccess,
      entity: IAMNodeEntity.Policy,
      json_schema: dynamoReadWritePolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: NodeCreationFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CREATED,
      validate_inside_code_editor: false,
      granted_accesses: [
        {
          target_node: ResourceNodeID.CloudFront,
          access_level: AccessLevel.Read,
          target_handle: 'bottom',
        },
      ],
      validate_function: AJV_COMPILER.compile(dynamoReadWritePolicySchema),
    },
  ],
];
