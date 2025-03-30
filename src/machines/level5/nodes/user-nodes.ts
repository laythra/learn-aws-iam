import { type Node } from 'reactflow';

import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNodeData>[] = [
  {
    id: UserNodeID.FinanceUser,
    label: 'finance-user',
    initial_position: 'bottom-center',
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: Node<IAMUserNodeData>[] =
  TUTORIAL_USER_NODES.map(createUserNode);
