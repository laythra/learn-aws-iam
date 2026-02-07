import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMPolicyNode } from '@/types/iam-node-types';

const POLICY_NODES: IAMNodeDataOverrides<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.PolicyNode1,
    label: 'S3ReadPolicy',
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
    label: 'DynamoDBReadPolicy',
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
    label: 'EC2ReadPolicy',
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

export const INITIAL_POLICY_NODES: IAMPolicyNode[] = POLICY_NODES.map(nodeData =>
  createPolicyNode({ dataOverrides: nodeData })
);
