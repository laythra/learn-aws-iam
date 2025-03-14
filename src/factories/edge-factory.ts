import _ from 'lodash';
import type { Edge } from 'reactflow';

import { theme } from '@/theme';
import { IAMEdgeData } from '@/types';
import { getEdgeName } from '@/utils/names';

type EdgeBaseProps = Omit<Edge<IAMEdgeData>, 'data'>;
type RequiredEdgeProps = Pick<EdgeBaseProps, 'source' | 'target'>;
type OptionalEdgeProps = Partial<Omit<EdgeBaseProps, 'source' | 'target'>>;

export type CreateEdgeProps = RequiredEdgeProps &
  OptionalEdgeProps & {
    data?: Partial<IAMEdgeData>;
  };

const EDGE_TEMPLATE: Edge<IAMEdgeData> = {
  id: 'template_edge',
  source: 'template_source',
  target: 'template_target',
  sourceHandle: 'top',
  targetHandle: 'bottom',
  focusable: true,
  deletable: true,
  markerEnd: 'arrow',
  animated: true,
  type: 'iam_default',
  data: {
    color: theme.colors.black,
    stroke_width: 1,
    hovering_color: theme.colors.blue[500],
    hovering_label: 'Attached to',
    label_always_visible: false,
  },
};

export const createEdge = (props: CreateEdgeProps): Edge<IAMEdgeData> => {
  return _.merge({}, EDGE_TEMPLATE, props, { id: getEdgeName(props.source, props.target) });
};
