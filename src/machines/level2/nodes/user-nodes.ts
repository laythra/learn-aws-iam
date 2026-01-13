import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.FirstUser,
    label: 'Kyouma',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    image: IAMNodeImage.User,
  },
];

export const INITIAL_USER_NODES: IAMUserNode[] = USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
