import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import { AccessLevel, CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [
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

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [
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
      ResourceNodeID.SNSTopic,
    ].map(resource => ({
      target_node: resource,
      target_handle: 'right',
      access_level: AccessLevel.Full,
      source_handle: 'left',
    })),
    editable: false,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMPolicyNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: false },
  })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMPolicyNode[] = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: false },
  })
);
