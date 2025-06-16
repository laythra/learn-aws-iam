import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { AccountID } from '@/machines/types';
import type { IAMUserNode } from '@/types';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TrustedAccountIAMUser,
    label: 'omar',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.User,
    account_id: AccountID.Trusted,
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
