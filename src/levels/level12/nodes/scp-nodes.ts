import { SCPNodeID } from '../types/node-ids';
import { MANAGED_POLICIES } from '@/domain/managed-policies';
import { createSCPNode } from '@/domain/nodes/scp-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMSCPNode } from '@/types/iam-node-types';

const TUTORIAL_SCP_NODES: IAMNodeDataOverrides<IAMSCPNode['data']>[] = [
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
