import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNodeData } from '@/types';

const USER_NODES: Partial<IAMUserNodeData>[] = [
  {
    id: UserNodeID.Laith,
    label: 'Laith',
    initial_position: 'left-center',
  },
  {
    id: UserNodeID.Ali,
    label: 'Ali',
    initial_position: 'left-center',
  },
  {
    id: UserNodeID.Mohammad,
    label: 'Mohammad',
    initial_position: 'right-center',
  },
  {
    id: UserNodeID.Khalid,
    label: 'Khalid',
    initial_position: 'right-center',
  },
];

export const INITIAL_USER_NODES = USER_NODES.map(createUserNode);
