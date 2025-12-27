import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types/objective-types';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types';

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: PolicyNodeID.TrustingAccountFinanceReportsReadPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.DYNAMODB_READ_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.Read,
            target_node: ResourceNodeID.TrustingAccountDynamoDBTable,
            target_handle: 'right',
          },
        ],
      },
      limit_new_lines: false,
      account_id: AccountID.TrustingAccount,
      created_node_parent_id: AccountID.TrustingAccount,
      layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.TrustedAccountAssumeRolePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.ASSUME_ROLE_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      extra_data: {
        granted_accesses: [],
      },
      limit_new_lines: false,
      account_id: AccountID.TrustedAccount,
      created_node_parent_id: AccountID.TrustedAccount,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
