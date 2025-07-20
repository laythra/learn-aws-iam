import { createHorizontalGroup } from '@/factories/layout-group-factory';

export enum LayoutGroupID {
  PaymentsTeamLayoutGroup = 'payments-team-layout-group',
  AnalyticsTeamLayoutGroup = 'analytics-team-layout-group',
  ComplianceTeamLayoutGroup = 'compliance-team-layout-group',
  RDSInstancesLayoutGroup = 'rds-instances-layout-group',
}

export const PAYMENTS_TEAM_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.PaymentsTeamLayoutGroup,
  'bottom-right',
  200
);

export const ANALYTICS_TEAM_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.AnalyticsTeamLayoutGroup,
  'bottom-center',
  200
);

export const COMPLIANCE_TEAM_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.ComplianceTeamLayoutGroup,
  'bottom-left',
  200
);

export const RDS_INSTANCES_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.RDSInstancesLayoutGroup,
  'top-center',
  200
);
