import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.S3ListBucketsPolicy,
    label: 'S3ListBuckets',
    content: JSON.stringify(INITIAL_POLICIES.S3ListBucketsAccess, null, 2),
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    editable: false,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMPolicyNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({ dataOverrides: nodeData })
);
