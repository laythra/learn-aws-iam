import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { MANAGED_POLICIES } from '@/levels/consts';
import { IAMIdentityPolicyCreationObjective, ObjectiveType } from '@/levels/types/objective-types';
import { createPolicyCreationObjective } from '@/levels/utils/factories/identity-policy-creation-objective-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

export const POLICY_CREATION_OBJECTIVES: IAMIdentityPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: PolicyNodeID.TrustingAccountFinanceReportsReadPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.DYNAMODB_READ_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.Read,
            target_node: ResourceNodeID.TrustingAccountDynamoDBTable,
            target_handle: 'right',
            source_handle: 'left',
          },
        ],
      },
      limit_new_lines: false,
      account_id: AccountID.TrustingAccount,
      created_node_parent_id: AccountID.TrustingAccount,
      layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    } satisfies Partial<IAMIdentityPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.TrustedAccountAssumeRolePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.ASSUME_ROLE_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      extra_data: {
        granted_accesses: [],
      },
      limit_new_lines: false,
      account_id: AccountID.TrustedAccount,
      created_node_parent_id: AccountID.TrustedAccount,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    } satisfies Partial<IAMIdentityPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
