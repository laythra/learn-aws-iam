import dynamodbRoleTrustPolicy from '../schemas/role/dynamodb-role-trust-policy-schema.json';
import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { RoleNodeID } from '../types/node-id-enums';
import { createRoleCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { AccountID, IAMRoleCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.DynamoDBReadRole,
      entity: IAMNodeEntity.Role,
      json_schema: dynamodbRoleTrustPolicy,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: RoleCreationFinishEvent.DYNAMODB_READ_ROLE_CREATED,
      validate_inside_code_editor: false,
      help_badges: [],
      validate_function: AJV_COMPILER.compile(dynamodbRoleTrustPolicy),
      required_policies: [],
      required_principles: [],
      created_node_initial_position: 'left-center',
      account_id: AccountID.Destination,
    },
  ].map(objective => createRoleCreationObjective(objective)),
];
