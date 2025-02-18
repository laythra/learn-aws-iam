import { HandleProps, Position, type Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.PublicImagesS3Bucket,
    label: 'public-images',
    initial_position: 'bottom-right',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
    handles: [{ id: Position.Top, type: 'target', position: Position.Top }] as HandleProps[],
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  TUTORIAL_RESOURCE_NODES.map(createResourceNode);
