import { theme } from '@/theme';
import { PartialWithRequired } from '@/types/common';
import { IAMEdge, PartialEdge } from '@/types/iam-node-types';
import { getEdgeName } from '@/utils/names';

type RootOverrides = PartialWithRequired<Omit<IAMEdge, 'data'>, 'source' | 'target'>;
const EDGE_TEMPLATE: PartialEdge = {
  id: 'template_edge',
  source: 'template_source',
  target: 'template_target',
  sourceHandle: 'top',
  targetHandle: 'bottom',
  focusable: true,
  deletable: true,
  markerEnd: 'arrow',
  animated: true,
  type: 'default',
  data: {
    type: 'default',
    color: theme.colors.black,
    stroke_width: 1,
    hovering_color: theme.colors.blue[500],
    hovering_label: 'Attached to',
    is_blocked: false,
  },
};

export const createEdge = ({
  rootOverrides,
  dataOverrides,
}: {
  rootOverrides: RootOverrides;
  dataOverrides?: Partial<IAMEdge['data']>;
}): IAMEdge => {
  return {
    ...EDGE_TEMPLATE,
    ...rootOverrides,
    id: getEdgeName(rootOverrides.source, rootOverrides.target),
    zIndex: dataOverrides?.source_node?.parentId ? 10 : 0,
    data: {
      ...EDGE_TEMPLATE.data,
      ...dataOverrides,
    },
  } as IAMEdge;
};
