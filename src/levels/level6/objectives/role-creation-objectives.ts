import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, RoleNodeID } from '../types/node-id-enums';
import { createRoleCreationObjective } from '@/factories/nodes_creation_objectives/role-creation-objective-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import { IAMRoleCreationObjective } from '@/levels/types/objective-types';
import { CommonLayoutGroupID } from '@/types/iam-enums';

export const CALLOUT_MESSAGE1 = `
  The \`Principal\` element in a trust policy defines
  which entity is allowed to assume the role.

  * \`{ "AWS": "<user_arn>" }\` defines an **IAM user principal**.
  * \`{ "Service": "<service>.amazonaws.com" }\` defines an **AWS service principal**.
`;

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: RoleNodeID.TrustingAccountDynamoDBReadRole,
      on_finish_event: RoleCreationFinishEvent.DYNAMODB_READ_ROLE_CREATED,
      layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
      account_id: AccountID.TrustingAccount,
      created_node_parent_id: AccountID.TrustingAccount,
      callout_message: CALLOUT_MESSAGE1,
      initial_code: MANAGED_POLICIES.EmptyTrustPolicy,

      extra_data: {
        required_policies: [],
        required_principles: [],
      },
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
  ].map(objective => createRoleCreationObjective(objective)),
];
