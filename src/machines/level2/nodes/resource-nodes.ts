import { type Node, HandleProps, Position } from 'reactflow';

import { INITIAL_RESOURCES_INFO } from '../config';
import { theme } from '@/theme';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeEntity, IAMNodeResourceEntity } from '@/types';

export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const Y_OFFSET = 100;

export const INITIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] = INITIAL_RESOURCES_INFO.map(
  ({ id, label, image }, index) => ({
    id,
    position: { x: X_OFFSET + index * X_OFFSET, y: Y_OFFSET },
    data: {
      id,
      label,
      entity: IAMNodeEntity.Resource,
      resource_type: IAMNodeResourceEntity.S3Bucket,
      image,
      handles: [{ id: Position.Top, type: 'target', position: Position.Bottom }] as HandleProps[],
    },
    type: 'iam_default',
    draggable: false,
  })
);
