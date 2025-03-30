import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/group-node-factory';
import type { IAMGroupNodeData } from '@/types';

const GROUP_NODES: Partial<IAMGroupNodeData>[] = [
  {
    id: GroupNodeID.FrontendGroup,
    label: 'frontend-team',
    initial_position: 'center',
  },
  {
    id: GroupNodeID.BackendGroup,
    label: 'backend-team',
    initial_position: 'center',
  },
];

export const INITIAL_GROUP_NODES = GROUP_NODES.map(createGroupNode);
