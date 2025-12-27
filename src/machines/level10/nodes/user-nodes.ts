import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMUserNode } from '@/types/iam-node-types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Davis,
    label: 'davis',
    layout_group_id: CommonLayoutGroupID.TopCenterVertical,
    tags: [['team', 'payments-team']],
  },
  {
    id: UserNodeID.John,
    label: 'john',
    layout_group_id: CommonLayoutGroupID.TopCenterVertical,
    tags: [['team', 'payments-team']],
  },
  {
    id: UserNodeID.Sarah,
    label: 'sarah',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [['team', 'compliance-team']],
  },
  {
    id: UserNodeID.Smith,
    label: 'smith',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [['team', 'compliance-team']],
  },
  {
    id: UserNodeID.Johnson,
    label: 'johnson',
    layout_group_id: CommonLayoutGroupID.BottomCenterVertical,
    tags: [['team', 'analytics-team']],
  },
  {
    id: UserNodeID.Michael,
    label: 'micheal',
    layout_group_id: CommonLayoutGroupID.BottomCenterVertical,
    tags: [['team', 'analytics-team']],
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { extent: 'parent', parentId: node.parent_id, draggable: false },
  })
);
