export type NodeSizingBreakpointID = 'sm' | 'md' | 'lg';

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
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Picks a sizing breakpoint based on viewport dimensions.
 * Both width and height are considered — a tall but narrow screen still gets 'sm'.
 */
function resolveBreakpointID(
  viewportWidth: number,
  viewportHeight: number
): NodeSizingBreakpointID {
  if (viewportWidth < 1100 || viewportHeight < 700) return 'sm';
  if (viewportWidth < 1400 || viewportHeight < 850) return 'md';
  return 'lg';
}

/**
 * Returns scaled node metrics for the given viewport dimensions.
 * Sizes are clamped so nodes never get too small or too large regardless of scale.
 */
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

/**
 * Reads metrics from the current window size.
 */
export function getCurrentRegularNodeMetrics(): RegularNodeMetrics {
  return getRegularNodeMetrics(window.innerWidth, window.innerHeight);
}
