import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMAccountNode, IAMNodeEntity, IAMNodeImage } from '@/types';

export const createAccountNode = createNodeFactory<IAMAccountNode['data'], IAMNodeEntity.Account>({
  type: 'account',
  entity: IAMNodeEntity.Account,
  image: IAMNodeImage.S3Bucket,
  height: 300,
  width: 800,
  defaultHandles: [{ id: HandleID.Top, type: 'source', position: Position.Top }],
  initial_position: 'bottom-center',
});
