import { UserNodeID } from '../types/node-ids';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Alex,
    label: 'alex',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
  },
  {
    id: UserNodeID.Sam,
    label: 'sam',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
  },
  {
    id: UserNodeID.Morgan,
    label: 'morgan',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
  },
  {
    id: UserNodeID.Jordan,
    label: 'jordan',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
  },
];

export const INITIAL_USER_NODES = USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
