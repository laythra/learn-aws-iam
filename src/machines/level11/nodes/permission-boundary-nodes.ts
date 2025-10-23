import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PermissionBoundaryID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { createPermissionBoundaryNode } from '@/factories/nodes/permission-boundary-node-factory';
import { CommonLayoutGroupID, IAMEdge, IAMPermissionBoundaryNode } from '@/types';

const TUTORIAL_PERMISSION_BOUNDARY_NODES: Partial<IAMPermissionBoundaryNode['data']>[] = [
  {
    id: PermissionBoundaryID.PermissionBoundary1,
    label: 'SNSReadOnlyBoundary',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    content: JSON.stringify(INITIAL_POLICIES.SNS_READ_ONLY_BOUNDARY, null, 2),
    is_edge_blocked: (edge: IAMEdge) => {
      return (
        edge.data?.source_node.id === UserNodeID.Sephiroth &&
        edge.data?.target_node.id === ResourceNodeID.S3BucketTutorial
      );
    },
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
