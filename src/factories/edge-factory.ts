import type { Edge } from '@xyflow/react';
import _ from 'lodash';

import { theme } from '@/theme';
import { IAMEdge, IAMEdgeData } from '@/types';
import { getEdgeName } from '@/utils/names';

type EdgeBaseProps = Omit<Edge<IAMEdgeData>, 'data'>;
type RequiredEdgeProps = Pick<EdgeBaseProps, 'source' | 'target'>;
type OptionalEdgeProps = Partial<Omit<EdgeBaseProps, 'source' | 'target'>>;

export type CreateEdgeProps = RequiredEdgeProps &
  OptionalEdgeProps & {
    data?: Partial<IAMEdgeData>;
  };

const EDGE_TEMPLATE: IAMEdge = {
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
    label_always_visible: false,
  },
};

export const createEdge = (props: CreateEdgeProps): IAMEdge => {
  return _.merge({}, EDGE_TEMPLATE, props, { id: getEdgeName(props.source, props.target) });
};
