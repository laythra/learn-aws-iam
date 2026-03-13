import { GroupNodeID } from '../types/node-ids';
import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMGroupNode } from '@/types/iam-node-types';

const IN_LEVEL_GROUP_NODES: IAMNodeDataOverrides<IAMGroupNode['data']>[] = [
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
