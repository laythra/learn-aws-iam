import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, HandleID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [];

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.SlackServiceManagePolicy,
    label: 'cross-account-secrets-read-access',
    layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    content: JSON.stringify(INITIAL_POLICIES.INITIAL_ROLE, null, 2),
    editable: true,
    granted_accesses: [
      {
        target_node: ResourceNodeID.SlackCrashlyticsNotifierService,
        access_level: AccessLevel.Read,
        source_handle: HandleID.Top,
        target_handle: HandleID.Bottom,
      },
      {
        target_node: ResourceNodeID.SlackIntegrationSecret,
        access_level: AccessLevel.Read,
        source_handle: HandleID.Top,
        target_handle: HandleID.Bottom,
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
