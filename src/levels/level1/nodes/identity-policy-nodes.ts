import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 'PublicImagesReadPolicy',
    image: IAMNodeImage.Policy,
    content: JSON.stringify(INITIAL_POLICIES.S3_READ_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    granted_accesses: [
      {
        target_node: ResourceNodeID.PublicImagesS3Bucket,
        target_handle: 'top',
        source_handle: 'bottom',
        access_level: AccessLevel.Read,
      },
    ],
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMIdentityPolicyNode[] = TUTORIAL_POLICY_NODES.map(
  nodeData => createIdentityPolicyNode({ dataOverrides: nodeData })
);
