import { createPolicyNode } from '@/factories/policy-node-factory';
import type { IAMPolicyNodeData } from '@/types';

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [];

export const INITIAL_IN_LEVEL_POLICY_NODES = IN_LEVEL_POLICY_NODES.map(createPolicyNode);
