import s3WriteAccessPolicySchema from '../schemas/policy/ec2-staging-s3-upload-policy.json';
import elasticacheManagementPolicySchema from '../schemas/policy/elasticcache-prod-management-policy.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { IAMPolicyCreationObjective } from '@/machines/types';
import { IAMNodeFilter } from '@/machines/utils/iam-node-filter';
import { AccessLevel, CommonLayoutGroupID, HandleID, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: PolicyNodeID.S3WriteAccessPolicy,
      entity_id: PolicyNodeID.S3WriteAccessPolicy,
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
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      validate_function: AJV_COMPILER.compile(s3WriteAccessPolicySchema),
      created_node_parent_id: AccountID.InLevelStagingAccount,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
    {
      id: PolicyNodeID.S3WriteAccessPolicy,
      entity_id: PolicyNodeID.S3WriteAccessPolicy,
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
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      validate_function: AJV_COMPILER.compile(s3WriteAccessPolicySchema),
      created_node_parent_id: AccountID.InLevelStagingAccount,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
    {
      id: PolicyNodeID.ElasticCacheManagementPolicy,
      entity_id: PolicyNodeID.ElasticCacheManagementPolicy,
      on_finish_event: PolicyCreationFinishEvent.ELASTICACHE_MANAGEMENT_POLICY_CREATED,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.Full,
            source_handle: HandleID.Top,
            target_handle: HandleID.Bottom,
            target_node: ResourceNodeID.InLevelProductionElastiCacheCluster1,
            applicable_nodes: nodes =>
              IAMNodeFilter.create()
                .fromNodes(nodes)
                .whereEntityIs(IAMNodeEntity.User)
                .whereHasTag('squad', 'notifications')
                .build(),
          },
          {
            access_level: AccessLevel.Full,
            source_handle: HandleID.Top,
            target_handle: HandleID.Bottom,
            target_node: ResourceNodeID.InLevelProductionElastiCacheCluster2,
            applicable_nodes: nodes =>
              IAMNodeFilter.create()
                .fromNodes(nodes)
                .whereEntityIs(IAMNodeEntity.User)
                .whereHasTag('squad', 'search')
                .build(),
          },
          {
            access_level: AccessLevel.Full,
            source_handle: HandleID.Top,
            target_handle: HandleID.Bottom,
            target_node: ResourceNodeID.InLevelProductionElastiCacheCluster3,
            applicable_nodes: nodes =>
              IAMNodeFilter.create()
                .fromNodes(nodes)
                .whereEntityIs(IAMNodeEntity.User)
                .whereHasTag('squad', 'payments')
                .build(),
          },
        ],
      },

      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      validate_function: AJV_COMPILER.compile(elasticacheManagementPolicySchema),
      created_node_parent_id: AccountID.InLevelProdAccount,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
