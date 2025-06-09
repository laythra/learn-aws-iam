import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { RoleNodeID } from '@/machines/level8/types/node-id-enums';
import { IAMRoleNode } from '@/types';

const IN_LEVEL_ROLE_NODES: Partial<IAMRoleNode['data']>[] = [
  {
    id: RoleNodeID.SlackCodeDeployRole,
    label: 'SlackCodeDeployRole',
    initial_position: 'left-center',
  },
];

export const INITIAL_IN_LEVEL_ROLE_NODES: IAMRoleNode[] = IN_LEVEL_ROLE_NODES.map(nodeData =>
  createRoleNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: false },
  })
);
