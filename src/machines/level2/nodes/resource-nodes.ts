import { type Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.S3Bucket,
    label: ResourceNodeID.S3Bucket,
    initial_position: 'top-center',
    image: IAMNodeImage.S3Bucket,
  },
  {
    id: ResourceNodeID.DynamoDBTable,
    label: ResourceNodeID.DynamoDBTable,
    initial_position: 'top-center',
    image: IAMNodeImage.Database,
  },
  {
    id: ResourceNodeID.EC2Instance,
    label: ResourceNodeID.EC2Instance,
    initial_position: 'top-center',
    image: IAMNodeImage.Server,
  },
];

export const INITIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  RESOURCE_NODES.map(createResourceNode);
