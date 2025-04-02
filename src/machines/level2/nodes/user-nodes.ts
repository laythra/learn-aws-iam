import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNode } from '@/types';
import { IAMNodeImage } from '@/types';

const USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.FirstUser,
    label: 'Kyouma',
    initial_position: 'center',
    image: IAMNodeImage.User,
  },
];

export const INITIAL_USER_NODES: IAMUserNode[] = USER_NODES.map(createUserNode);
