import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { AccountID } from '@/machines/types';
import type { IAMUserNode } from '@/types';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TutorialFirstUser,
    label: 'leon-kennedy',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.User,
    account_id: AccountID.Trusted,
  },
];

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.InsideLevelUser,
    label: 'leon-kennedy',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.User,
    account_id: AccountID.Trusted,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
