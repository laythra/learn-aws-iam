import { ResourceNodeID } from '../types/node-ids';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.CustomerDataDynamoTable,
    label: 'customer-data',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.AnalyticsDataDynamoTable,
    label: 'analytics-data',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.TimeshiftAssetsS3Bucket,
    label: 'timeshift-assets',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);
