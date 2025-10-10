import dynamodbRoleTrustPolicy from '../schemas/role/dynamodb-role-trust-policy-schema.json';
import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { RoleNodeID } from '../types/node-id-enums';
import { createRoleCreationObjective } from '@/factories/nodes_creation_objectives/role-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { AccountID, IAMRoleCreationObjective } from '@/machines/types';
import { CommonLayoutGroupID } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const CALLOUT_MESSAGE1 = `
  The \`Principal\` part in the trust policy defines the entity that is allowed to assume the role.

  * \`{ "AWS": "<user_arn>" }\` defines an **IAM User** Principal.
  * \`{ "Service": "<service-name>.amazonaws.com" }\` defines an **AWS Service** Principal.
`;

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: RoleNodeID.TrustingAccountDynamoDBReadRole,
      entity_id: RoleNodeID.TrustingAccountDynamoDBReadRole,
      json_schema: dynamodbRoleTrustPolicy,
      on_finish_event: RoleCreationFinishEvent.DYNAMODB_READ_ROLE_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(dynamodbRoleTrustPolicy),
      layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
      account_id: AccountID.Trusting,
      callout_message: CALLOUT_MESSAGE1,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      extra_data: {
        required_policies: [],
        required_principles: [],
      },
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
  ].map(objective => createRoleCreationObjective(objective)),
];
