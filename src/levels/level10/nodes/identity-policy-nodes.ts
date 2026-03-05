import { createIdentityPolicyNode } from '@/factories/nodes/identity-policy-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [];

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMIdentityPolicyNode[] = TUTORIAL_POLICY_NODES.map(
  nodeData =>
    createIdentityPolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { parentId: nodeData.parent_id, draggable: false },
    })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMIdentityPolicyNode[] = IN_LEVEL_POLICY_NODES.map(
  nodeData =>
    createIdentityPolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { parentId: nodeData.parent_id },
    })
);
