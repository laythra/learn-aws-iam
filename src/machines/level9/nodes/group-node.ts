import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { CommonLayoutGroupID, type IAMGroupNode } from '@/types';

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.PeachTeam,
    label: 'peach-team',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    layout_direction: 'horizontal',
  },
  {
    id: GroupNodeID.BowserForce,
    label: 'bowser-force',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    layout_direction: 'horizontal',
  },
];

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData })
);
