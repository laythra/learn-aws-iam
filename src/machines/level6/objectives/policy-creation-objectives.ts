import assumeRolePolicySchema from '../schemas/policy/assume-role-policy-schema.json';
import dynamodbReadPolicySchema from '../schemas/policy/dynamodb-read-policy-schema.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { MANAGED_POLICIES } from '@/machines/config';
import { AccountID, IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.DynamoDBTableReadAccess,
      entity: IAMNodeEntity.Policy,
      json_schema: dynamodbReadPolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: PolicyCreationFinishEvent.DYNAMODB_READ_POLICY_CREATED,
      validate_inside_code_editor: false,
      granted_accesses: [
        {
          access_level: AccessLevel.Read,
          target_node: ResourceNodeID.FirstAccountDynamoDBTable,
          target_handle: 'right',
        },
      ],
      validate_function: AJV_COMPILER.compile(dynamodbReadPolicySchema),
      limit_new_lines: false,
      account_id: AccountID.Destination,
      created_node_initial_position: 'left-center',
    },
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.AssumeRolePolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: assumeRolePolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: PolicyCreationFinishEvent.ASSUME_ROLE_POLICY_CREATED,
      validate_inside_code_editor: false,
      granted_accesses: [],
      validate_function: AJV_COMPILER.compile(assumeRolePolicySchema),
      limit_new_lines: false,
      account_id: AccountID.Originating,
      created_node_initial_position: 'right-center',
    },
  ],
];
