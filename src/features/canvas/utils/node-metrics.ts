export type NodeSizingBreakpointID = 'sm' | 'md' | 'lg' | 'xl';

export interface RegularNodeMetrics {
  breakpointId: NodeSizingBreakpointID;
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  offsetScale: number;
}

export const BASE_REGULAR_NODE_METRICS = {
  nodeWidth: 225,
  nodeHeight: 82,
  spacingPadding: 20,
};

const BREAKPOINT_SCALES: Record<NodeSizingBreakpointID, number> = {
  sm: 0.82,
  md: 0.9,
  lg: 1,
  xl: 1.08,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function resolveBreakpointID(
  viewportWidth: number,
  viewportHeight: number
): NodeSizingBreakpointID {
  if (viewportWidth < 1100 || viewportHeight < 700) return 'sm';
  if (viewportWidth < 1400 || viewportHeight < 850) return 'md';
  if (viewportWidth < 1800 || viewportHeight < 980) return 'lg';
  return 'xl';
}

export function getRegularNodeMetrics(
  viewportWidth: number,
  viewportHeight: number
): RegularNodeMetrics {
  const breakpointId = resolveBreakpointID(viewportWidth, viewportHeight);
  const scale = BREAKPOINT_SCALES[breakpointId];

  const nodeWidth = clamp(Math.round(BASE_REGULAR_NODE_METRICS.nodeWidth * scale), 170, 260);
  const nodeHeight = clamp(Math.round(BASE_REGULAR_NODE_METRICS.nodeHeight * scale), 62, 96);
  const spacingPadding = Math.max(12, Math.round(BASE_REGULAR_NODE_METRICS.spacingPadding * scale));

  return {
    breakpointId,
    nodeWidth,
    nodeHeight,
    horizontalSpacing: nodeWidth + spacingPadding,
    verticalSpacing: nodeHeight + spacingPadding,
    offsetScale: nodeWidth / BASE_REGULAR_NODE_METRICS.nodeWidth,
  };
}

export function getCurrentRegularNodeMetrics(): RegularNodeMetrics {
  if (typeof window === 'undefined') {
    return {
      breakpointId: 'lg',
      nodeWidth: BASE_REGULAR_NODE_METRICS.nodeWidth,
      nodeHeight: BASE_REGULAR_NODE_METRICS.nodeHeight,
      horizontalSpacing:
        BASE_REGULAR_NODE_METRICS.nodeWidth + BASE_REGULAR_NODE_METRICS.spacingPadding,
      verticalSpacing:
        BASE_REGULAR_NODE_METRICS.nodeHeight + BASE_REGULAR_NODE_METRICS.spacingPadding,
      offsetScale: 1,
    };
  }

  return getRegularNodeMetrics(window.innerWidth, window.innerHeight);
}
