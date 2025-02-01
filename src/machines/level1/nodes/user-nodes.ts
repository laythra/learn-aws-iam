import { type Node } from 'reactflow';

import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMUserNodeData>[] = [
  {
    id: UserNodeID.TutorialUser,
    label: 'Laith',
    initial_position: 'center',
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: Node<IAMUserNodeData>[] =
  TUTORIAL_POLICY_NODES.map(createUserNode);
