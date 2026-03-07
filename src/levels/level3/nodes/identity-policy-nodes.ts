import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID } from '../types/node-id-enums';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.S3ListBucketsPolicy,
    label: 'S3ListBuckets',
    content: JSON.stringify(INITIAL_POLICIES.S3ListBucketsAccess, null, 2),
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    editable: false,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMIdentityPolicyNode[] = TUTORIAL_POLICY_NODES.map(
  nodeData => createIdentityPolicyNode({ dataOverrides: nodeData })
);
