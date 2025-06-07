import { AccountNodeID, PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, type IAMPolicyNode } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [];

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.InLevelPermissionPolicy,
    label: 'cross-account-secrets-read-access',
    initial_position: 'bottom-left',
    parent_id: AccountNodeID.Staging,
    // content: JSON.stringify(INITIAL_POLICIES.TUTORIA_SECRETS_READ_PERMISSION_POLICY, null, 2),
    granted_accesses: [
      {
        target_node: ResourceNodeID.InLevelSecret1,
        access_level: AccessLevel.Read,
        target_handle: 'left',
        source_handle: 'right',
      },
    ],
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMPolicyNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: nodeData.parent_id, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMPolicyNode[] = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: nodeData.parent_id },
  })
);
