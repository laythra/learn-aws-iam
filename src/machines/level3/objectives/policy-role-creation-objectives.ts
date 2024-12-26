import Ajv from 'ajv';

import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import cloudfrontReadPolicySchema from '../schemas/policy/cloudfront-read-policy-schema.json';
import dynamoReadWritePolicySchema from '../schemas/policy/dynamo-db-read-write-policy-schema.json';
import s3ReadPolicySchema from '../schemas/policy/s3-read-policy-schema.json';
import s3ReadWritePolicySchema from '../schemas/policy/s3-read-write-policy-schema.json';
import { FinishEventMap, NodeCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyRoleCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';

const AJV_COMPILER = new Ajv();

export const POLICY_ROLE_CREATION_OBJECTIVES: IAMPolicyRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.S3ReadWriteAcces,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadPolicySchema,
      initial_code: INITIAL_POLICIES.S3ReadAccess,
      description:
        'Create a policy that allows read/write access\
          to the S3 bucket: public-assets',
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
      type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.S3ReadWriteAcces,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWritePolicySchema,
      initial_code: INITIAL_POLICIES.S3ReadAccess,
      on_finish_event: NodeCreationFinishEvent.S3_READ_WRITE_POLICY_CREATED,
      validate_inside_code_editor: false,
      granted_accesses: [
        {
          target_node: ResourceNodeID.S3Bucket,
          access_level: AccessLevel.ReadWrite,
          target_handle: 'bottom',
        },
      ],
      validate_function: AJV_COMPILER.compile(s3ReadWritePolicySchema),
    },
    {
      type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE,
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
      type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE,
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
