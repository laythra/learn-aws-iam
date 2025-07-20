import { LayoutGroupID } from '../layout-groups';
import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { IAMUserNode } from '@/types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Davis,
    label: 'david',
    layout_group_id: LayoutGroupID.PaymentsTeamLayoutGroup,
    tags: [['team', 'payments-team']],
  },
  {
    id: UserNodeID.John,
    label: 'luigi',
    layout_group_id: LayoutGroupID.PaymentsTeamLayoutGroup,
    tags: [['team', 'payments-team']],
  },
  {
    id: UserNodeID.Johnson,
    label: 'johnson',
    layout_group_id: LayoutGroupID.AnalyticsTeamLayoutGroup,
    tags: [['team', 'analytics-team']],
  },
  {
    id: UserNodeID.Michael,
    label: 'micheal',
    layout_group_id: LayoutGroupID.AnalyticsTeamLayoutGroup,
    tags: [['team', 'analytics-team']],
  },
  {
    id: UserNodeID.Sarah,
    label: 'sarah',
    layout_group_id: LayoutGroupID.ComplianceTeamLayoutGroup,
    tags: [['team', 'compliance-team']],
  },
  {
    id: UserNodeID.Smith,
    label: 'smith',
    layout_group_id: LayoutGroupID.ComplianceTeamLayoutGroup,
    tags: [['team', 'compliance-team']],
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { extent: 'parent', parentId: node.parent_id },
  })
);
