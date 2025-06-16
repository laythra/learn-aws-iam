import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import type { IAMUserNode } from '@/types';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.FinanceUser,
    label: 'finance-user',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
