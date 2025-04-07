import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMNodeEntity, IAMNodeImage, IAMResourceNode } from '@/types';

export const createResourceNode = createNodeFactory<
  IAMResourceNode['data'],
  IAMNodeEntity.Resource
>({
  type: 'resource',
  entity: IAMNodeEntity.Resource,
  image: IAMNodeImage.S3Bucket,
  defaultHandles: [
    { id: HandleID.Top, type: 'source', position: Position.Top },
    { id: HandleID.Right, type: 'source', position: Position.Right },
    { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
    { id: HandleID.Left, type: 'source', position: Position.Left },
  ],
  initial_position: 'bottom-center',
});
