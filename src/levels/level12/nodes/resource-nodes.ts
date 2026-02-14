import { LayoutGroupID } from '../layout-groups';
import { AccountID, ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.TutorialCloudTrailProd,
    label: 'access-trail',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    image: IAMNodeImage.CloudTrail,
    resource_type: IAMNodeResourceEntity.CloudTrail,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: ResourceNodeID.TutorialCloudTrailStaging,
    label: 'access-trail',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    image: IAMNodeImage.CloudTrail,
    resource_type: IAMNodeResourceEntity.CloudTrail,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
];

const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.InLevelStagingS3Bucket,
    label: 'staging-artifacts',
    layout_group_id: CommonLayoutGroupID.TopRightHorizontal,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
  },
  {
    id: ResourceNodeID.InLevelStagingEC2Instance,
    label: 'rails-web-server',
    layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.EC2Instance,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
  },
  {
    id: ResourceNodeID.InLevelProductionElastiCacheCluster1,
    label: 'notifications-ec-cluster',
    layout_group_id: LayoutGroupID.InLevelElasticCacheLayoutGroup,
    image: IAMNodeImage.Billing,
    resource_type: IAMNodeResourceEntity.ElastiCache,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'notifications']],
  },
  {
    id: ResourceNodeID.InLevelProductionElastiCacheCluster2,
    label: 'search-ec-cluster',
    layout_group_id: LayoutGroupID.InLevelElasticCacheLayoutGroup,
    image: IAMNodeImage.Billing,
    resource_type: IAMNodeResourceEntity.ElastiCache,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'search']],
  },
  {
    id: ResourceNodeID.InLevelProductionElastiCacheCluster3,
    label: 'payments-ec-cluster',
    layout_group_id: LayoutGroupID.InLevelElasticCacheLayoutGroup,
    image: IAMNodeImage.Billing,
    resource_type: IAMNodeResourceEntity.ElastiCache,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'payments']],
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: IAMResourceNode[] = TUTORIAL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: true, parentId: nodeData.parent_id },
    })
);

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: true, parentId: nodeData.parent_id },
    })
);
