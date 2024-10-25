import { type Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.PublicImagesS3Bucket,
    label: 'public-images',
    initial_position: 'center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  TUTORIAL_RESOURCE_NODES.map(createResourceNode);
