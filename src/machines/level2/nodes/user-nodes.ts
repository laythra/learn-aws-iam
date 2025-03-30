import { type Node } from 'reactflow';

import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const USER_NODES: Partial<IAMUserNodeData>[] = [
  {
    id: UserNodeID.FirstUser,
    label: 'Kyouma',
    initial_position: 'center',
    image: IAMNodeImage.User,
  },
];

export const INITIAL_USER_NODES: Node<IAMUserNodeData>[] = USER_NODES.map(createUserNode);
