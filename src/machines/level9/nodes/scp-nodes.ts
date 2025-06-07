import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { AccountNodeID, SCPNodeID } from '../types/node-id-enums';
import { createSCPNode } from '@/factories/nodes/scp-node-factory';
import { IAMSCPNode } from '@/types';

const TUTORIAL_SCP_NODES: Partial<IAMSCPNode['data']>[] = [];

const IN_LEVEL_SCP_NODES: Partial<IAMSCPNode['data']>[] = [
  {
    id: SCPNodeID.InLevelOUSCP,
    label: 'full-access-scp',
    initial_position: 'top-right',
    vertical_spacing: 100,
    content: JSON.stringify(INITIAL_POLICIES.IN_LEVEL_INITIAL_SCP, null, 2),
  },
];

export const INITIAL_TUTORIAL_SCP_NODES: IAMSCPNode[] = TUTORIAL_SCP_NODES.map(nodeData =>
  createSCPNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: AccountNodeID.Dev, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_SCP_NODES: IAMSCPNode[] = IN_LEVEL_SCP_NODES.map(nodeData =>
  createSCPNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: false },
  })
);
