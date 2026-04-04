import { INITIAL_TRUST_POLICIES } from '../initial-roles';
import { RoleNodeID } from '../types/node-ids';
import { createRoleNode } from '@/domain/nodes/role-node-factory';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMRoleNode } from '@/types/iam-node-types';

const TUTORIAL_ROLE_NODES: IAMNodeDataOverrides<IAMRoleNode['data']>[] = [
  {
    id: RoleNodeID.FinanceAuditorRole,
    label: 'FinanceAuditorRole',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    image: IAMNodeImage.Role,
    editable: true,
    content: JSON.stringify(INITIAL_TRUST_POLICIES.TUTORIAL_ROLE_TRUST_POLICY1, null, 2),
  },
];

export const INITIAL_TUTORIAL_ROLE_NODES: IAMRoleNode[] = TUTORIAL_ROLE_NODES.map(nodeData =>
  createRoleNode({ dataOverrides: nodeData })
);
