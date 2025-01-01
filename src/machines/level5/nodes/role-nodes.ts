import { type Node } from 'reactflow';

import { INITIAL_TRUST_POLICIES } from '../policy_role_documents/initial-roles';
import { PolicyNodeID, RoleNodeID } from '../types/node-id-enums';
import { createRoleNode } from '@/factories/role-node-factory';
import type { IAMRoleNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_ROLE_NODES: Partial<IAMRoleNodeData>[] = [
  {
    id: RoleNodeID.FinanceAuditorRole,
    label: 'Finance Auditor Role Trust Policy',
    initial_position: 'center',
    image: IAMNodeImage.Role,
    associated_users: [],
    editable: true,
    content: JSON.stringify(INITIAL_TRUST_POLICIES.TUTORIAL_ROLE_TRUST_POLICY1, null, 2),
    associated_policies: [PolicyNodeID.BillingPolicy],
  },
];

export const INITIAL_TUTORIAL_ROLE_NODES: Node<IAMRoleNodeData>[] =
  TUTORIAL_ROLE_NODES.map(createRoleNode);
