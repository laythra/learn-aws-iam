import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID, type IAMUserNode } from '@/types';

const USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Laith,
    label: 'Laith',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
  },
  {
    id: UserNodeID.Ali,
    label: 'Ali',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
  },
  {
    id: UserNodeID.Mohammad,
    label: 'Mohammad',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
  },
  {
    id: UserNodeID.Khalid,
    label: 'Khalid',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
  },
];

export const INITIAL_USER_NODES = USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
