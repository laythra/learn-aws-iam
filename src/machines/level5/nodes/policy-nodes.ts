import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import type { IAMPolicyNodeData } from '@/types';
import { AccessLevel, IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.BillingPolicy,
    label: 'billing-read-policy',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        target_node: ResourceNodeID.BillingAndCostManagement,
        target_handle: 'right',
        access_level: AccessLevel.Read,
      },
    ],
  },
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 's3-read-policy',
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

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.UsersCertificatesS3ReadPolicy,
    label: 'users-certs-s3-read',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    content: JSON.stringify(INITIAL_POLICIES.S3_READ_POLICY, null, 2),
    granted_accesses: [
      {
        target_node: ResourceNodeID.UsersCertificatesS3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
        source_handle: 'top',
      },
    ],
  },
  {
    id: PolicyNodeID.UsersCertificatesS3WritePolicy,
    label: 'users-certs-s3-write',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    content: JSON.stringify(INITIAL_POLICIES.S3_WRITE_POLICY, null, 2),
    granted_accesses: [
      {
        target_node: ResourceNodeID.UsersCertificatesS3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Write,
        source_handle: 'top',
      },
    ],
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES = TUTORIAL_POLICY_NODES.map(createPolicyNode);
export const INITIAL_IN_LEVEL_POLICY_NODES = IN_LEVEL_POLICY_NODES.map(createPolicyNode);
