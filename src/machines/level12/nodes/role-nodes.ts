import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { AccountID, RoleNodeID } from '../types/node-id-enums';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types/iam-enums';
import { IAMRoleNode } from '@/types/iam-node-types';

const IN_LEVEL_ROLE_NODES: Partial<IAMRoleNode['data']>[] = [
  {
    id: RoleNodeID.EC2LaunchRole,
    label: 'ec2-launch-role',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Role,
    editable: true,
    content: JSON.stringify(INITIAL_POLICIES.EC2_TRUST_POLICY, null, 2),
    account_id: AccountID.TutorialStagingAccount,
    parent_id: AccountID.TutorialStagingAccount,
  },
];

export const INITIAL_IN_LEVEL_ROLE_NODES: IAMRoleNode[] = IN_LEVEL_ROLE_NODES.map(nodeData =>
  createRoleNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: nodeData.parent_id },
  })
);
