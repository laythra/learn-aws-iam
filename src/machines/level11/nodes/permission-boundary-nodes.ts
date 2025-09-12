import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PermissionBoundaryID } from '../types/node-id-enums';
import { createPermissionBoundaryNode } from '@/factories/nodes/permission-boundary-node-factory';
import { CommonLayoutGroupID, IAMPermissionBoundaryNode } from '@/types';

const TUTORIAL_PERMISSION_BOUNDARY_NODES: Partial<IAMPermissionBoundaryNode['data']>[] = [
  {
    id: PermissionBoundaryID.PermissionBoundary1,
    label: 'SNSReadOnlyBoundary',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    content: JSON.stringify(INITIAL_POLICIES.SNS_READ_ONLY_BOUNDARY, null, 2),
    is_edge_blocked: () => true,
    blocked_edge_content: 'Access Blocked By Permission Boundary 🔒',
  },
];

export const INITIAL_TUTORIAL_PERMISSION_BOUNDARY_NODES: IAMPermissionBoundaryNode[] =
  TUTORIAL_PERMISSION_BOUNDARY_NODES.map(nodeData =>
    createPermissionBoundaryNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false },
    })
  );
