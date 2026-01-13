import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMGroupNode } from '@/types/iam-node-types';

const GROUP_NODES: IAMNodeDataOverrides<IAMGroupNode['data']>[] = [
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
