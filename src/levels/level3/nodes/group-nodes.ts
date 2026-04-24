import { GroupNodeID } from '../types/node-ids';
import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMGroupNode } from '@/types/iam-node-types';

const GROUP_NODES: IAMNodeDataOverrides<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.FrontendGroup,
    label: 'frontend-team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: GroupNodeID.BackendGroup,
    label: 'backend-team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
];

export const INITIAL_GROUP_NODES = GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData })
);
