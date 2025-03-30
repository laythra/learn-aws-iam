import { type Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.S3Bucket,
    label: 'public-images',
    initial_position: 'top-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.DynamoDBTable,
    label: 'analytics',
    initial_position: 'top-center',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.EC2Instance,
    label: 'i-0abc123def456gh78',
    initial_position: 'top-center',
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.EC2Instance,
  },
];

export const INITIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  RESOURCE_NODES.map(createResourceNode);
