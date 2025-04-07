import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import type { IAMPolicyNode } from '@/types';
import { AccessLevel, IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.BillingPolicy,
    label: 'BillingReadPolicy',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        target_node: ResourceNodeID.BillingAndCostManagement,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
        source_handle: 'top',
      },
    ],
  },
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 'S3ReadPolicy',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        target_node: ResourceNodeID.FinanceS3Bucket,
        target_handle: 'right',
        access_level: AccessLevel.Read,
      },
    ],
  },
];

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.ChatImagesS3ReadPolicy,
    label: 'ChatImagesS3Read',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    content: JSON.stringify(INITIAL_POLICIES.S3_READ_POLICY, null, 2),
    granted_accesses: [
      {
        target_node: ResourceNodeID.ChatImagesS3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
        source_handle: 'top',
      },
    ],
  },
  {
    id: PolicyNodeID.ChatImagesS3WritePolicy,
    label: 'ChatImagesS3Write',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    content: JSON.stringify(INITIAL_POLICIES.S3_WRITE_POLICY, null, 2),
    granted_accesses: [
      {
        target_node: ResourceNodeID.ChatImagesS3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Write,
        source_handle: 'top',
      },
    ],
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({ dataOverrides: nodeData })
);
export const INITIAL_IN_LEVEL_POLICY_NODES = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({ dataOverrides: nodeData })
);
