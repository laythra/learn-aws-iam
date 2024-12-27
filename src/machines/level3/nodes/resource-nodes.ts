import type { Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.S3Bucket,
    label: 'public-assets',
    initial_position: 'top-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.CloudFront,
    label: 'E1234567890ABC',
    initial_position: 'top-center',
    image: IAMNodeImage.CDN,
    resource_type: IAMNodeResourceEntity.CloudFront,
  },
  {
    id: ResourceNodeID.DynamoDBTable,
    label: 'user-profiles',
    initial_position: 'top-center',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
];

export const INITIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  RESOURCE_NODES.map(createResourceNode);
