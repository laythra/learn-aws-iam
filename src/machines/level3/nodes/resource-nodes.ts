import _ from 'lodash';
import { type Node, HandleProps, Position } from 'reactflow';

import { theme } from '@/theme';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeEntity, IAMNodeImage, IAMNodeResourceEntity } from '@/types';

export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const Y_OFFSET = 100;

export enum ResourceNodeID {
  S3Bucket = 'iam_resource_1',
  CloudFront = 'iam_resource_2',
  DynamoDBTable = 'iam_resource_3',
}

export const TEMPLATE_RESOURCE_NODE: Node<IAMResourceNodeData> = {
  id: 'iam_resources',
  position: { x: 100, y: 100 },
  type: 'iam_default',
  draggable: true,
  data: {
    id: 'iam_group',
    label: 'IAM Resource',
    entity: IAMNodeEntity.Resource,
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'target', position: Position.Right },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
      { id: Position.Left, type: 'target', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
};

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
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

export const INITIAL_IN_LEVEL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  IN_LEVEL_RESOURCE_NODES.map(({ id, label, initial_position, image, resource_type }) =>
    _.merge({}, TEMPLATE_RESOURCE_NODE, {
      id,
      data: {
        id,
        label,
        initial_position,
        image,
        resource_type,
      },
    })
  );
