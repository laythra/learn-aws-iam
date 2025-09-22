import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMAccountNode, IAMNodeEntity } from '@/types';

export const createAccountNode = createNodeFactory<IAMAccountNode['data'], IAMNodeEntity.Account>({
  type: 'account',
  entity: IAMNodeEntity.Account,
  image: 'NONE',
  height: 300,
  width: 800,
  defaultHandles: [{ id: HandleID.Top, type: 'source', position: Position.Top }],
  initial_position: 'bottom-center',
});
