import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNode } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.FinanceUser,
    label: 'finance-user',
    initial_position: 'bottom-center',
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(createUserNode);
