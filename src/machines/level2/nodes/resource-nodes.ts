import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import type { IAMResourceNode } from '@/types';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.S3Bucket,
    label: 'public-images',
    image: IAMNodeImage.S3Bucket,
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.DynamoDBTable,
    label: 'analytics',
    image: IAMNodeImage.Database,
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.EC2Instance,
    label: 'i-0abc123def456gh78',
    image: IAMNodeImage.Server,
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    resource_type: IAMNodeResourceEntity.EC2Instance,
  },
];

export const INITIAL_RESOURCE_NODES: IAMResourceNode[] = RESOURCE_NODES.map(nodeData =>
  createResourceNode({ dataOverrides: nodeData })
);
