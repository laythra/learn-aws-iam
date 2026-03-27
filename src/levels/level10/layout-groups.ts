import { createHorizontalGroup, createVerticalGroup } from '@/domain/layout-group-factory';
import { BASE_REGULAR_NODE_METRICS } from '@/domain/node-metrics';

export enum LayoutGroupID {
  GroupNodesLayoutGroup = 'group-nodes-layout-group',
  EC2InstancesLayoutGroup = 'ec2-instances-layout-group',
}

const GROUP_NODES_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.GroupNodesLayoutGroup,
  'top-center',
  BASE_REGULAR_NODE_METRICS.nodeHeight + 40,
  { left: -BASE_REGULAR_NODE_METRICS.nodeWidth - 100, top: 0 }
);

const EC2_INSTANCES_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.EC2InstancesLayoutGroup,
  'right-center'
);

export const LAYOUT_GROUPS = [GROUP_NODES_LAYOUT_GROUP, EC2_INSTANCES_LAYOUT_GROUP];
