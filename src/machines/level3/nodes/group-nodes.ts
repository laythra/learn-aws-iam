import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { IAMGroupNode } from '@/types';

const GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.FrontendGroup,
    label: 'frontend-team',
    initial_position: 'center',
    layout_direction: 'vertical',
  },
  {
    id: GroupNodeID.BackendGroup,
    label: 'backend-team',
    initial_position: 'center',
    layout_direction: 'vertical',
  },
];

export const INITIAL_GROUP_NODES = GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData })
);
