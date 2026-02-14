import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [];

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMPolicyNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { parentId: nodeData.parent_id, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMPolicyNode[] = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { parentId: nodeData.parent_id },
  })
);
