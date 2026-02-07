import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Mario,
    label: 'mario',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
    layout_direction: 'vertical',
    tags: [['application', 'peach-team']],
  },
  {
    id: UserNodeID.Luigi,
    label: 'luigi',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
    layout_direction: 'vertical',
    tags: [['application', 'peach-team']],
  },
  {
    id: UserNodeID.Peach,
    label: 'peach',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
    layout_direction: 'vertical',
    tags: [['application', 'mashroom-team']],
  },
  {
    id: UserNodeID.Bowser,
    label: 'bowser',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    layout_direction: 'vertical',
    tags: [['application', 'bowser-force']],
  },
  {
    id: UserNodeID.Wario,
    label: 'wario',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    layout_direction: 'vertical',
    tags: [['application', 'bowser-force']],
  },
  {
    id: UserNodeID.Waluigi,
    label: 'waluigi',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    layout_direction: 'vertical',
    tags: [['application', 'bowser-force']],
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { extent: 'parent', parentId: node.parent_id },
  })
);
