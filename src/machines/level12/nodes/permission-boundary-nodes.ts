import { createPermissionBoundaryNode } from '@/factories/nodes/permission-boundary-node-factory';
import { IAMPermissionBoundaryNode } from '@/types';

const TUTORIAL_PERMISSION_BOUNDARY_NODES: Partial<IAMPermissionBoundaryNode['data']>[] = [];

export const INITIAL_TUTORIAL_PERMISSION_BOUNDARY_NODES: IAMPermissionBoundaryNode[] =
  TUTORIAL_PERMISSION_BOUNDARY_NODES.map(nodeData =>
    createPermissionBoundaryNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false },
    })
  );
