import { type Node } from 'reactflow';

import { INITIAL_TRUST_POLICIES } from '../policy_role_documents/initial-roles';
import { RoleNodeID } from '../types/node-id-enums';
import { createRoleNode } from '@/factories/role-node-factory';
import type { IAMRoleNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_ROLE_NODES: Partial<IAMRoleNodeData>[] = [
  {
    id: RoleNodeID.FinanceAuditorRole,
    label: 'finance-auditor-role',
    initial_position: 'center',
    image: IAMNodeImage.Role,
    editable: true,
    content: JSON.stringify(INITIAL_TRUST_POLICIES.TUTORIAL_ROLE_TRUST_POLICY1, null, 2),
  },
];

export const INITIAL_TUTORIAL_ROLE_NODES: Node<IAMRoleNodeData>[] =
  TUTORIAL_ROLE_NODES.map(createRoleNode);
