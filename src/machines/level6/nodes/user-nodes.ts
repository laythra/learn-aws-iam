import { type Node } from 'reactflow';

import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import { AccountID } from '@/machines/types';
import type { IAMUserNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNodeData>[] = [
  {
    id: UserNodeID.OriginatingAccountAuditorUser,
    label: UserNodeID.OriginatingAccountAuditorUser,
    initial_position: 'right-center',
    image: IAMNodeImage.User,
    account_id: AccountID.Originating,
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: Node<IAMUserNodeData>[] =
  IN_LEVEL_USER_NODES.map(createUserNode);
