import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { type IAMGroupNode } from '@/types';

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.PeachTeam,
    label: 'peach-team',
    initial_position: 'bottom-center',
    layout_direction: 'horizontal',
  },
  {
    id: GroupNodeID.BowserForce,
    label: 'bowser-force',
    initial_position: 'bottom-center',
    layout_direction: 'horizontal',
  },
];

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData })
);
