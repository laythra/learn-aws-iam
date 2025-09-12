import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { AccountID, PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, type IAMPolicyNode } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.TutorialProdCloudTrailAccess,
    label: 'cloudtrail-access',
    content: JSON.stringify(INITIAL_POLICIES.CLOUDTRAIL_DELETE_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
    granted_accesses: [
      {
        target_node: ResourceNodeID.TutorialCloudTrailProd,
        target_handle: 'right',
        source_handle: 'left',
        access_level: AccessLevel.Full,
      },
    ],
    editable: false,
  },
  {
    id: PolicyNodeID.TutorialStagingCloudTrailAccess,
    label: 'cloudtrail-access',
    content: JSON.stringify(INITIAL_POLICIES.CLOUDTRAIL_DELETE_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
    granted_accesses: [
      {
        target_node: ResourceNodeID.TutorialCloudTrailStaging,
        target_handle: 'right',
        source_handle: 'left',
        access_level: AccessLevel.Full,
      },
    ],
    editable: false,
  },
];

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMPolicyNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: nodeData.parent_id },
  })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMPolicyNode[] = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: nodeData.parent_id },
  })
);
