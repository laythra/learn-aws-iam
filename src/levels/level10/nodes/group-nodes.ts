import { LayoutGroupID } from '../layout-groups';
import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMGroupNode } from '@/types/iam-node-types';

const IN_LEVEL_GROUP_NODES: IAMNodeDataOverrides<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.PaymentsTeam,
    label: 'payments-team',
    layout_group_id: LayoutGroupID.GroupNodesLayoutGroup,
  },
  {
    id: GroupNodeID.ComplianceTeam,
    label: 'compliance-team',
    layout_group_id: LayoutGroupID.GroupNodesLayoutGroup,
  },

  {
    id: GroupNodeID.AnalyticsTeam,
    label: 'analytics-team',
    layout_group_id: LayoutGroupID.GroupNodesLayoutGroup,
  },
];

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData, rootOverrides: { draggable: false } })
);
