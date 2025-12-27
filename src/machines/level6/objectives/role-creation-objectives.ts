import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, RoleNodeID } from '../types/node-id-enums';
import { createRoleCreationObjective } from '@/factories/nodes_creation_objectives/role-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { IAMRoleCreationObjective } from '@/machines/types/objective-types';
import { CommonLayoutGroupID } from '@/types';

export const CALLOUT_MESSAGE1 = `
  The \`Principal\` part in the trust policy defines the entity that is allowed to assume the role.

  * \`{ "AWS": "<user_arn>" }\` defines an **IAM User** Principal.
  * \`{ "Service": "<service-name>.amazonaws.com" }\` defines an **AWS Service** Principal.
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
