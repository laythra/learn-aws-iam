import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMPolicyNode } from '@/types/iam-node-types';

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [];

export const INITIAL_IN_LEVEL_POLICY_NODES = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({ dataOverrides: nodeData })
);
