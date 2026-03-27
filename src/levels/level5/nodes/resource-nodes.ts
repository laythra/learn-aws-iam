import { ResourceNodeID } from '../types/node-ids';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.FinanceS3Bucket,
    label: 'financial-reports-bucket',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.BillingAndCostManagement,
    label: 'monthly-spend-budget',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
    image: IAMNodeImage.Billing,
    resource_type: IAMNodeResourceEntity.Billing,
  },
];

const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.LambdaFunction,
    label: 'lambda-fn',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    image: IAMNodeImage.Lambda,
    resource_type: IAMNodeResourceEntity.Lambda,
  },
  {
    id: ResourceNodeID.ChatImagesS3Bucket,
    label: 'chat-images',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.EC2Instance,
    label: 'web-server',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.EC2Instance,
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: IAMResourceNode[] = TUTORIAL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);
