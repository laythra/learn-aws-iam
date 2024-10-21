import type { Edge } from 'reactflow';

import { IAMEdgeData } from '@/types';
import { PartialWithRequired } from '@/types/common';
import { getEdgeName } from '@/utils/names';

const EDGE_TEMPLATE: Edge<IAMEdgeData> = {
  id: 'template_edge',
  source: 'template_source',
  target: 'template_target',
  sourceHandle: 'top',
  targetHandle: 'bottom',
  focusable: true,
  markerEnd: 'arrow',
  animated: true,
  type: 'iam_default',
  style: { stroke: '#f6ab6c' },
  data: {
    is_hovering: false,
  },
};

export const createEdge = (
  props: PartialWithRequired<Edge<IAMEdgeData>, 'source' | 'target'>
): Edge<IAMEdgeData> => {
  return {
    ...EDGE_TEMPLATE,
    ...props,
    ...{
      id: getEdgeName(props.source, props.target),
    },
  };
};
