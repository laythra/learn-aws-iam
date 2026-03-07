import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { AccountID, PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { AccessLevel, CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.TutorialProdCloudTrailAccess,
    label: 'cloudtrail-access',
    content: JSON.stringify(INITIAL_POLICIES.CLOUDTRAIL_DELETE_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
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
    layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
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

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMIdentityPolicyNode[] = TUTORIAL_POLICY_NODES.map(
  nodeData =>
    createIdentityPolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { parentId: nodeData.parent_id },
    })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMIdentityPolicyNode[] = IN_LEVEL_POLICY_NODES.map(
  nodeData =>
    createIdentityPolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { parentId: nodeData.parent_id },
    })
);
