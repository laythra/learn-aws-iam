import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMAccountNode, IAMNodeEntity, IAMNodeImage } from '@/types';

export const createAccountNode = createNodeFactory<IAMAccountNode['data'], IAMNodeEntity.Account>({
  type: 'ou',
  entity: IAMNodeEntity.Account,
  image: IAMNodeImage.S3Bucket,
  defaultHandles: [
    { id: HandleID.Top, type: 'source', position: Position.Top },
    { id: HandleID.Right, type: 'source', position: Position.Right },
    { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
    { id: HandleID.Left, type: 'source', position: Position.Left },
  ],
  initial_position: 'bottom-center',
});
