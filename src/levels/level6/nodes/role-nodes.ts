import { createRoleNode } from '@/domain/nodes/role-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMRoleNode } from '@/types/iam-node-types';

const TUTORIAL_ROLE_NODES: IAMNodeDataOverrides<IAMRoleNode['data']>[] = [];

export const INITIAL_TUTORIAL_ROLE_NODES: IAMRoleNode[] = TUTORIAL_ROLE_NODES.map(nodeData =>
  createRoleNode({ dataOverrides: nodeData })
);
