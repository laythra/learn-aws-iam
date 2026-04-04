import { INITIAL_POLICIES } from '../initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, HandleID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [];

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.SlackCodeDeployPolicy,
    label: 'SlackCodeDeployPolicy',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    content: JSON.stringify(INITIAL_POLICIES.CODEDEPLOY, null, 2),
    editable: false,
    granted_accesses: [
      {
        target_node: ResourceNodeID.SlackCrashlyticsNotifierService,
        access_level: AccessLevel.Read,
        source_handle: HandleID.Top,
        target_handle: HandleID.Bottom,
        edge_label: 'Deployment Access',
      },
    ],
  },
  {
    id: PolicyNodeID.SlackSecretsAccessPolicy,
    label: 'SlackSecretsAccessPolicy',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    content: JSON.stringify(INITIAL_POLICIES.SECRETS_ACCESS, null, 2),
    editable: true,
    granted_accesses: [
      {
        target_node: ResourceNodeID.SlackIntegrationSecret,
        access_level: AccessLevel.Read,
        source_handle: HandleID.Top,
        target_handle: HandleID.Bottom,
        edge_label: 'Read Access',
      },
    ],
  },
];

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
