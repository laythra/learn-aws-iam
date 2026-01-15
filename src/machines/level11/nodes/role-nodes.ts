import { RoleNodeID } from '../types/node-id-enums';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { INITIAL_POLICIES } from '@/machines/level11/policy_role_documents/initial-policies';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMRoleNode } from '@/types/iam-node-types';

const IN_LEVEL_ROLE_NODES: IAMNodeDataOverrides<IAMRoleNode['data']>[] = [
  {
    id: RoleNodeID.Role1,
    label: 'secrets-reader-role',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.Role,
    editable: true,
    content: JSON.stringify(INITIAL_POLICIES.DELEGATE_PERMISSIONS_ROLE, null, 2),
  },
];

export const INITIAL_IN_LEVEL_ROLE_NODES: IAMRoleNode[] = IN_LEVEL_ROLE_NODES.map(nodeData =>
  createRoleNode({ dataOverrides: nodeData })
);
