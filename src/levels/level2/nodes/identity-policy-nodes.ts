import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.PolicyNode1,
    label: 'AmazonS3ReadOnlyAccess',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        access_level: AccessLevel.Read,
        target_handle: 'bottom',
        target_node: ResourceNodeID.S3Bucket,
      },
    ],
  },
  {
    id: PolicyNodeID.PolicyNode2,
    label: 'AmazonDynamoDBReadOnlyAccess',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    image: IAMNodeImage.Policy,

    granted_accesses: [
      {
        access_level: AccessLevel.Read,
        target_handle: 'bottom',
        target_node: ResourceNodeID.DynamoDBTable,
      },
    ],
  },
  {
    id: PolicyNodeID.PolicyNode3,
    label: 'AmazonEC2ReadOnlyAccess',
    image: IAMNodeImage.Policy,
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,

    granted_accesses: [
      {
        access_level: AccessLevel.Read,
        target_handle: 'bottom',
        target_node: ResourceNodeID.EC2Instance,
      },
    ],
  },
];

export const INITIAL_POLICY_NODES: IAMIdentityPolicyNode[] = POLICY_NODES.map(nodeData =>
  createIdentityPolicyNode({ dataOverrides: nodeData })
);
