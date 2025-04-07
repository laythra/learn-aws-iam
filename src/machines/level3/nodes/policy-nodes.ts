import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyNode } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 'S3ReadAccess',
    content: JSON.stringify(MANAGED_POLICIES.AWSS3ReadOnlyAccess, null, 2),
    initial_position: 'center',
    editable: false,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMPolicyNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({ dataOverrides: nodeData })
);
