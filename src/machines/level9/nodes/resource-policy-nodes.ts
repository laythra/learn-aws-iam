import { AccountNodeID, ResourceNodeID, ResourcePolicyNodeID } from '../types/node-id-enums';
import { createResourcePolicyNode } from '@/factories/nodes/resource-policy-node-factory';
import { AccessLevel, HandleID, IAMResourcePolicyNode } from '@/types';

const TUTORIAL_RESOURCE_POLICY_NODES: Partial<IAMResourcePolicyNode['data']>[] = [];

const IN_LEVEL_RESOURCE_POLICY_NODES: Partial<IAMResourcePolicyNode['data']>[] = [
  {
    id: ResourcePolicyNodeID.InLevelResourceBasedPolicy,
    label: 's3-read-access',
    granted_accesses: [
      {
        target_node: ResourceNodeID.InLevelSecret1,
        target_handle: HandleID.Right,
        access_level: AccessLevel.Read,
        source_handle: HandleID.Left,
      },
    ],
    initial_position: 'top-right',
    parent_id: AccountNodeID.Prod,
    resource_node_id: ResourceNodeID.InLevelSecret1,
  },
];

export const INITIAL_TUTORIAL_RESOURCE_POLICY_NODES: IAMResourcePolicyNode[] =
  TUTORIAL_RESOURCE_POLICY_NODES.map(nodeData =>
    createResourcePolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { extent: 'parent', parentId: nodeData.parent_id, draggable: false },
    })
  );

export const INITIAL_IN_LEVEL_RESOURCE_POLICY_NODES: IAMResourcePolicyNode[] =
  IN_LEVEL_RESOURCE_POLICY_NODES.map(nodeData =>
    createResourcePolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { extent: 'parent', parentId: nodeData.parent_id },
    })
  );
