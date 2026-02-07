import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { RoleNodeID } from '@/levels/level8/types/node-id-enums';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMRoleNode } from '@/types/iam-node-types';

const IN_LEVEL_ROLE_NODES: IAMNodeDataOverrides<IAMRoleNode['data']>[] = [
  {
    id: RoleNodeID.SlackCodeDeployRole,
    label: 'SlackCodeDeployRole',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
  },
];

export const INITIAL_IN_LEVEL_ROLE_NODES: IAMRoleNode[] = IN_LEVEL_ROLE_NODES.map(nodeData =>
  createRoleNode({
    dataOverrides: nodeData,
  })
);
