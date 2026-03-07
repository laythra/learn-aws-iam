import { createHorizontalGroup, createVerticalGroup } from '@/domain/layout-group-factory';
import { BASE_REGULAR_NODE_METRICS } from '@/domain/node-metrics';

export enum LayoutGroupID {
  GroupNodesLayoutGroup = 'group-nodes-layout-group',
  RDSInstancesLayoutGroup = 'rds-instances-layout-group',
}

const GROUP_NODES_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.GroupNodesLayoutGroup,
  'top-center',
  BASE_REGULAR_NODE_METRICS.nodeHeight + 40,
  { left: -BASE_REGULAR_NODE_METRICS.nodeWidth - 100, top: 0 }
);

const RDS_INSTANCES_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.RDSInstancesLayoutGroup,
  'right-center'
);

export const LAYOUT_GROUPS = [GROUP_NODES_LAYOUT_GROUP, RDS_INSTANCES_LAYOUT_GROUP];
