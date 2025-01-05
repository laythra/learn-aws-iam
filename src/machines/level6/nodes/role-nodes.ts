import { type Node } from 'reactflow';

import { createRoleNode } from '@/factories/role-node-factory';
import type { IAMRoleNodeData } from '@/types';

const TUTORIAL_ROLE_NODES: Partial<IAMRoleNodeData>[] = [];

export const INITIAL_TUTORIAL_ROLE_NODES: Node<IAMRoleNodeData>[] =
  TUTORIAL_ROLE_NODES.map(createRoleNode);
