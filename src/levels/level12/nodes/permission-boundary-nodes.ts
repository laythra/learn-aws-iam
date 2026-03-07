import { createPermissionBoundaryNode } from '@/domain/nodes/permission-boundary-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMPermissionBoundaryNode } from '@/types/iam-node-types';

const TUTORIAL_PERMISSION_BOUNDARY_NODES: IAMNodeDataOverrides<
  IAMPermissionBoundaryNode['data']
>[] = [];

export const INITIAL_TUTORIAL_PERMISSION_BOUNDARY_NODES: IAMPermissionBoundaryNode[] =
  TUTORIAL_PERMISSION_BOUNDARY_NODES.map(nodeData =>
    createPermissionBoundaryNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false },
    })
  );
