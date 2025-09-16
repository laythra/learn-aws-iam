import { SCPNodeID } from '../types/node-id-enums';
import { createSCPNode } from '@/factories/nodes/scp-node-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { CommonLayoutGroupID, IAMSCPNode } from '@/types';

const TUTORIAL_SCP_NODES: Partial<IAMSCPNode['data']>[] = [
  {
    id: SCPNodeID.DefaultSCP,
    label: 'FullAWSAccess',
    layout_group_id: CommonLayoutGroupID.TopRightVertical,
    content: JSON.stringify(MANAGED_POLICIES.FullAccessPolicy, null, 2),
  },
];

export const INITIAL_TUTORIAL_SCP_NODES: IAMSCPNode[] = TUTORIAL_SCP_NODES.map(nodeData =>
  createSCPNode({ dataOverrides: nodeData, rootOverrides: { draggable: false } })
);
