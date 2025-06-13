import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { CommonLayoutGroupID, IAMGroupNode } from '@/types';

const GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.FrontendGroup,
    label: 'frontend-team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    layout_direction: 'vertical',
  },
  {
    id: GroupNodeID.BackendGroup,
    label: 'backend-team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    layout_direction: 'vertical',
  },
];

export const INITIAL_GROUP_NODES = GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData })
);
