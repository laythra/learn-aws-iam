import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { MANAGED_POLICIES } from '@/domain/managed-policies';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { AccessLevel, CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.Policy1,
    label: 'S3ReadAccess',
    content: JSON.stringify(INITIAL_POLICIES.S3_READ_ONLY_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    granted_accesses: [
      {
        target_node: ResourceNodeID.S3BucketTutorial,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
      },
    ],
    editable: false,
  },
];

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.FullAccessPolicy,
    label: 'AdministratorAccess',
    content: JSON.stringify(MANAGED_POLICIES.FullAccessPolicy, null, 2),
    layout_group_id: CommonLayoutGroupID.TopRightHorizontal,
    granted_accesses: [
      ResourceNodeID.LambdaFunction,
      ResourceNodeID.S3BucketInLevel,
      ResourceNodeID.Secret1,
      ResourceNodeID.Secret2,
      ResourceNodeID.ElasticCache,
    ].map(resource => ({
      target_node: resource,
      target_handle: 'right',
      access_level: AccessLevel.Full,
      edge_label: 'Read/Describe Access',
      source_handle: 'left',
    })),
    editable: false,
  },
  {
    id: PolicyNodeID.AssumeRolePolicy,
    label: 'AssumeRolePolicy',
    content: JSON.stringify(INITIAL_POLICIES.ASSUME_ROLE_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.TopRightHorizontal,
    editable: false,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMIdentityPolicyNode[] = TUTORIAL_POLICY_NODES.map(
  nodeData =>
    createIdentityPolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false },
    })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMIdentityPolicyNode[] = IN_LEVEL_POLICY_NODES.map(
  nodeData =>
    createIdentityPolicyNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false },
    })
);
