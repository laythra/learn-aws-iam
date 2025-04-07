import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import type { IAMResourceNode } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.CustomerDataDynamoTable,
    label: 'customer-data',
    initial_position: 'top-center',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.AnalyticsDataDynamoTable,
    label: 'analytics-data',
    initial_position: 'top-center',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.TimeshiftAssetsS3Bucket,
    label: 'timeshift-assets',
    initial_position: 'top-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);
