import { OUNodeID } from '../types/node-id-enums';
import { createOUNode } from '@/factories/nodes/ou-node-factory';
import { CommonLayoutGroupID, IAMOUNode } from '@/types';

const TUTORIAL_OU_NODES: Partial<IAMOUNode['data']>[] = [
  {
    id: OUNodeID.TutorialOU,
    label: 'Organizational Unit.',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
  },
];

export const INITIAL_TUTORIAL_OU_NODES: IAMOUNode[] = TUTORIAL_OU_NODES.map(nodeData =>
  createOUNode({ dataOverrides: nodeData, rootOverrides: { draggable: false } })
);
