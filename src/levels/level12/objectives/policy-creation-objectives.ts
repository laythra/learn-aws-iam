import { LayoutGroupID } from '../layout-groups';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import { IAMPolicyCreationObjective } from '@/levels/types/objective-types';
import { AccessLevel, CommonLayoutGroupID, HandleID } from '@/types/iam-enums';

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: PolicyNodeID.S3WriteAccessPolicy,
      on_finish_event: PolicyCreationFinishEvent.S3_WRITE_POLICY_CREATED,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.Write,
            source_handle: HandleID.Top,
            target_handle: HandleID.Bottom,
            target_node: ResourceNodeID.InLevelStagingS3Bucket,
          },
        ],
      },
      alert_message:
        'Attach this policy (somewhere) to grant S3 write permissions to the EC2 instance.',
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      created_node_parent_id: AccountID.InLevelStagingAccount,
      account_id: AccountID.InLevelStagingAccount,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
    {
      id: PolicyNodeID.ElasticCacheManagementPolicy,
      on_finish_event: PolicyCreationFinishEvent.ELASTICACHE_MANAGEMENT_POLICY_CREATED,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.Full,
            source_handle: HandleID.Bottom,
            target_handle: HandleID.Top,
            target_node: ResourceNodeID.InLevelProductionElastiCacheCluster1,
            applicable_nodes_fn_name: 'notificationsSquadApplicableNodes',
          },
          {
            access_level: AccessLevel.Full,
            source_handle: HandleID.Bottom,
            target_handle: HandleID.Top,
            target_node: ResourceNodeID.InLevelProductionElastiCacheCluster2,
            applicable_nodes_fn_name: 'searchSquadApplicableNodes',
          },
          {
            access_level: AccessLevel.Full,
            source_handle: HandleID.Bottom,
            target_handle: HandleID.Top,
            target_node: ResourceNodeID.InLevelProductionElastiCacheCluster3,
            applicable_nodes_fn_name: 'paymentsSquadApplicableNodes',
          },
        ],
      },

      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      created_node_parent_id: AccountID.InLevelProdAccount,
      account_id: AccountID.InLevelProdAccount,
      alert_message: 'Connect this policy to groups to grant ElastiCache management permissions.',
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.AccessDelegationPolicy,
      on_finish_event: PolicyCreationFinishEvent.ACCESS_DELEGATION_POLICY_CREATED,
      extra_data: {
        granted_accesses: [],
      },
      limit_new_lines: false,
      layout_group_id: LayoutGroupID.InLevelAccessDelegationPolicyLayoutGroup,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      created_node_parent_id: AccountID.InLevelStagingAccount,
      account_id: AccountID.InLevelStagingAccount,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
