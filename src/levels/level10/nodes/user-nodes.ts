import { UserNodeID } from '../types/node-ids';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Alex,
    label: 'alex',
    layout_group_id: CommonLayoutGroupID.TopCenterVertical,
    tags: [['application', 'payments-team']],
  },
  {
    id: UserNodeID.Sam,
    label: 'sam',
    layout_group_id: CommonLayoutGroupID.TopCenterVertical,
    tags: [['application', 'payments-team']],
  },
  {
    id: UserNodeID.Morgan,
    label: 'morgan',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [['application', 'compliance-team']],
  },
  {
    id: UserNodeID.Jordan,
    label: 'jordan',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [['application', 'compliance-team']],
  },
  {
    id: UserNodeID.Casey,
    label: 'casey',
    layout_group_id: CommonLayoutGroupID.BottomCenterVertical,
    tags: [['application', 'analytics-team']],
  },
  {
    id: UserNodeID.Taylor,
    label: 'taylor',
    layout_group_id: CommonLayoutGroupID.BottomCenterVertical,
    tags: [['application', 'analytics-team']],
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { parentId: node.parent_id, draggable: false },
  })
);
