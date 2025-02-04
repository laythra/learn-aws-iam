import type { Node } from 'reactflow';

import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyNodeData } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.S3ReadAccess,
    label: PolicyNodeID.S3ReadAccess,
    content: JSON.stringify(MANAGED_POLICIES.AWSS3ReadOnlyAccess, null, 2),
    initial_position: 'center',
    editable: false,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] =
  TUTORIAL_POLICY_NODES.map(createPolicyNode);
