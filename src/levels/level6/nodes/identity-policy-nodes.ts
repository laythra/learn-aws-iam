import { createIdentityPolicyNode } from '@/factories/nodes/identity-policy-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [];

export const INITIAL_IN_LEVEL_POLICY_NODES = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createIdentityPolicyNode({ dataOverrides: nodeData })
);
