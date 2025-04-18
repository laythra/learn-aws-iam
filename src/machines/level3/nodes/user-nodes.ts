import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import type { IAMUserNode } from '@/types';

const USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Laith,
    label: 'Laith',
    initial_position: 'left-center',
    layout_direction: 'vertical',
  },
  {
    id: UserNodeID.Ali,
    label: 'Ali',
    initial_position: 'left-center',
    layout_direction: 'vertical',
  },
  {
    id: UserNodeID.Mohammad,
    label: 'Mohammad',
    initial_position: 'right-center',
    layout_direction: 'vertical',
  },
  {
    id: UserNodeID.Khalid,
    label: 'Khalid',
    initial_position: 'right-center',
    layout_direction: 'vertical',
  },
];

export const INITIAL_USER_NODES = USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
