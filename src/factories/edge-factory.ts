import type { Edge } from 'reactflow';

import { PartialWithRequired } from '@/types/common';
import { getEdgeName } from '@/utils/names';

const EDGE_TEMPLATE: Edge = {
  id: 'template_edge',
  source: 'template_source',
  target: 'template_target',
  animated: true,
  type: 'smoothstep',
  style: { stroke: '#f6ab6c' },
};

export const createEdge = (props: PartialWithRequired<Edge, 'source' | 'target'>): Edge => {
  return {
    ...EDGE_TEMPLATE,
    ...props,
    ...{
      id: getEdgeName(props.source, props.target),
      type: props.source.includes('user') ? 'smoothstep' : 'straight',
      label: props.source.includes('user') ? 'Belongs to' : 'Attached to',
    },
  };
};
