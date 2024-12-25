import Ajv from 'ajv';

import cloudfrontReadPolicySchema from '../schemas/policy/cloudfront-read-policy-schema.json';
import s3ReadPolicySchema from '../schemas/policy/s3-read-policy-schema.json';
import s3ReadWritePolicySchema from '../schemas/policy/s3-read-write-policy-schema.json';
import { FinishEventMap, NodeCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyRoleCreationObjective, ObjectiveType } from '@/machines/types';
import iamPolicySchema from '@/schemas/aws-iam-policy-schema.json';
import { IAMNodeEntity } from '@/types';

const AJV_COMPILER = new Ajv();

export const POLICY_ROLE_CREATION_OBJECTIVES: IAMPolicyRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.S3ReadWriteAcces,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadPolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      description:
        'Create a policy that allows read/write access\
          to the S3 bucket: public-assets',
      on_finish_event: NodeCreationFinishEvent.S3_READ_POLICY_CREATED,
      validate_inside_code_editor: true,
      resource_affected: [],
      validate_function: AJV_COMPILER.compile(s3ReadPolicySchema),
      help_badges: [
        {
          path: 'Statement',
          content: "LOOKS LIKE IT'S HITTING YOU PRETTY DAMN HARD!!!",
          color: 'green',
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
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: NodeCreationFinishEvent.S3_READ_WRITE_POLICY_CREATED,
      validate_inside_code_editor: false,
      resource_affected: [ResourceNodeID.S3Bucket],
      validate_function: AJV_COMPILER.compile(s3ReadPolicySchema),
    },
    {
      type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.CloudfrontReadAccess,
      entity: IAMNodeEntity.Policy,
      json_schema: cloudfrontReadPolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: NodeCreationFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CREATED,
      validate_inside_code_editor: false,
      resource_affected: [ResourceNodeID.DynamoDBTable],
      validate_function: AJV_COMPILER.compile(iamPolicySchema),
    },
    {
      type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.DynamoDBReadWriteAccess,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWritePolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: NodeCreationFinishEvent.CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED,
      validate_inside_code_editor: false,
      resource_affected: [ResourceNodeID.CloudFront],
      validate_function: AJV_COMPILER.compile(s3ReadPolicySchema),
    },
  ],
];
