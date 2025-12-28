import { type Node } from '@xyflow/react';

import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { IAMRoleNode } from '@/types/iam-node-types';

const TUTORIAL_ROLE_NODES: Partial<IAMRoleNode['data']>[] = [];

export const INITIAL_TUTORIAL_ROLE_NODES: Node<IAMRoleNode['data']>[] = TUTORIAL_ROLE_NODES.map(
  nodeData => createRoleNode({ dataOverrides: nodeData })
);
