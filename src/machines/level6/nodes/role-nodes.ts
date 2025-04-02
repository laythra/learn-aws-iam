import { createRoleNode } from '@/factories/role-node-factory';
import type { IAMRoleNode } from '@/types';

const TUTORIAL_ROLE_NODES: Partial<IAMRoleNode['data']>[] = [];

export const INITIAL_TUTORIAL_ROLE_NODES: IAMRoleNode[] = TUTORIAL_ROLE_NODES.map(createRoleNode);
