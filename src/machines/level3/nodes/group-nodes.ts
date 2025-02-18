import { GroupNodeID, UserNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/group-node-factory';
import type { IAMGroupNodeData } from '@/types';

const GROUP_NODES: Partial<IAMGroupNodeData>[] = [
  {
    id: GroupNodeID.FrontendGroup,
    label: 'frontend-team',
    initial_position: 'center',
    associated_users: [UserNodeID.Laith, UserNodeID.Ali],
  },
  {
    id: GroupNodeID.BackendGroup,
    label: 'backend-team',
    initial_position: 'center',
    associated_users: [UserNodeID.Mohammad, UserNodeID.Khalid],
  },
];

export const INITIAL_GROUP_NODES = GROUP_NODES.map(createGroupNode);
