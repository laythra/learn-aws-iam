import { GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { CommonLayoutGroupID, type IAMGroupNode } from '@/types';

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.ComplianceTeam,
    label: 'compliance-team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },

  {
    id: GroupNodeID.AnalyticsTeam,
    label: 'analytics-team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: GroupNodeID.PaymentsTeam,
    label: 'payments-team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
];

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData })
);
