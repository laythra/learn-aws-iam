import { AccountID, UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TrustedAccountIAMUser,
    label: 'omar',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    image: IAMNodeImage.User,
    account_id: AccountID.TrustedAccount,
    parent_id: AccountID.TrustedAccount,
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData, rootOverrides: { parentId: nodeData.parent_id } })
);
