import { AccountNodeID, ResourceNodeID, SCPNodeID } from '../types/node-id-enums';
import { createSCPNode } from '@/factories/nodes/scp-node-factory';
import { AccessLevel, HandleID, IAMSCPNode } from '@/types';

const TUTORIAL_SCP_NODES: Partial<IAMSCPNode['data']>[] = [
  {
    id: SCPNodeID.TutorialSCP,
    label: 'secrets-read-access',
    initial_position: 'bottom-left',
    parent_id: AccountNodeID.Dev,
    granted_accesses: [
      ResourceNodeID.TutorialSecret1,
      ResourceNodeID.TutorialSecret2,
      ResourceNodeID.TutorialSecret3,
    ].map(resource => ({
      target_node: resource,
      access_level: AccessLevel.Read,
      target_handle: HandleID.Top,
      source_handle: HandleID.Bottom,
    })),
  },
];

export const INITIAL_TUTORIAL_SCP_NODES: IAMSCPNode[] = TUTORIAL_SCP_NODES.map(nodeData =>
  createSCPNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: AccountNodeID.Dev, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_SCP_NODES: IAMSCPNode[] = [];
