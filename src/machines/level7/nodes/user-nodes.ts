import { UserNodeID, AccountID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMUserNode } from '@/types/iam-node-types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TutorialFirstUser,
    label: 'leon-kennedy',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.User,
  },
];

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.InsideLevelUser,
    label: 'leon-kennedy',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.User,
    account_id: AccountID.TrustedAccount,
    parent_id: AccountID.TrustedAccount,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData, rootOverrides: { parentId: nodeData.parent_id } })
);
