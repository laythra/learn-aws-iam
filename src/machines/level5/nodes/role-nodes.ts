import { INITIAL_TRUST_POLICIES } from '../policy_role_documents/initial-roles';
import { RoleNodeID } from '../types/node-id-enums';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMRoleNode } from '@/types/iam-node-types';

const TUTORIAL_ROLE_NODES: Partial<IAMRoleNode['data']>[] = [
  {
    id: RoleNodeID.FinanceAuditorRole,
    label: 'finance-auditor-role',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    image: IAMNodeImage.Role,
    editable: true,
    content: JSON.stringify(INITIAL_TRUST_POLICIES.TUTORIAL_ROLE_TRUST_POLICY1, null, 2),
  },
];

export const INITIAL_TUTORIAL_ROLE_NODES: IAMRoleNode[] = TUTORIAL_ROLE_NODES.map(nodeData =>
  createRoleNode({ dataOverrides: nodeData })
);
