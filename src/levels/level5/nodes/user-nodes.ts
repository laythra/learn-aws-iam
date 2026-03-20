import { UserNodeID } from '../types/node-ids';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const TUTORIAL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.FinanceUser,
    label: 'alex',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
