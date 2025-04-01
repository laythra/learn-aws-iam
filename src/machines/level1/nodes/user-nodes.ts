import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNode } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TutorialUser,
    label: 'Laith',
    initial_position: 'center',
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_POLICY_NODES.map(createUserNode);
