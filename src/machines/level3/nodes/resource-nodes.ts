import type { Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.PublicImagesS3Bucket,
    label: 'public-images',
    initial_position: 'bottom-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

const RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.PublicImagesS3Bucket,
    label: 'public-assets',
    initial_position: 'top-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.CloudFront,
    label: 'E1A2B3C4D5E6F7',
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
export const INITIAL_TUTORIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  TUTORIAL_RESOURCE_NODES.map(createResourceNode);

export const INITIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  RESOURCE_NODES.map(createResourceNode);
