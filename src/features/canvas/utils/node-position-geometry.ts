import { XYPosition, Viewport } from '@xyflow/react';

import { getCurrentRegularNodeMetrics } from '@/domain/node-metrics';
import { theme } from '@/theme';
import {
  NodeLayoutGroup,
  ValidInitialPosition,
  VALID_INITIAL_POSITIONS,
} from '@/types/iam-layout-types';
import { IAMAnyNode } from '@/types/iam-node-types';

export const BETWEEN_NODES_SPACING = 20;

/**
 * When a node has no parent, we calculate its center relative to the canvas.
 */
function getCanvasCenter(viewport: Viewport, sidePanelWidth: number): XYPosition {
  const { x, y, zoom } = viewport;

  const navbarHeight = theme.sizes.navbarHeightInPixels;
  const originX = (window.innerWidth - sidePanelWidth) / 2 / zoom - x;
  const originY = (window.innerHeight - navbarHeight) / 2 / zoom - y;
  return { x: originX, y: originY };
}

/**
 * When a node is inside a parent, we calculate the center of the parent node.
 * In the parent's coordinate system, (0,0) is the top-left.
 */
function getParentCenterPosition(parentNode: IAMAnyNode): XYPosition {
  return {
    x: parentNode.width! / 2,
    y: parentNode.height! / 2,
  };
}

/**
 * Adjusts the position of a node based on the layout group margin.
 * This is used to ensure that nodes are positioned correctly within their layout group.
 * Currently, only supports top and left margins.
 */
function adjustPositionForMargin(
  position: XYPosition,
  layoutGroup: NodeLayoutGroup,
  offsetScale: number
): XYPosition {
  if (!layoutGroup.margin) return position;

  return {
    x: position.x + (layoutGroup.margin.left || 0) * offsetScale,
    y: position.y + (layoutGroup.margin.top || 0) * offsetScale,
  };
}

/**
 * Calculates the initial position of a node within a canvas or parent node.
 *
 * This function determines where a node should be placed based on its configuration,
 * viewport settings, and optionally its parent node. The position can be relative to
 * either the canvas center or the parent node's center.
 *
 * @param node - The IAM node for which to calculate the initial position
 * @param viewport - The current viewport state containing zoom and pan information
 * @param numNodes - The total number of nodes in the layout group
 * @param nodeIndex - The zero-based index of this node within its layout group
 * @param sidePanelWidth - The width of the side panel in pixels, used to adjust canvas calculations
 * @param layoutGroup - The layout configuration group containing position, spacing, and direction settings
 * @param parentNode - Optional parent node. If provided, positions are calculated relative to the parent's center
 *
 * @returns An XYPosition object containing the calculated x and y coordinates for the node.
 *          Returns {x: 0, y: 0} if the initial_position is invalid or not specified.
 *
 * @remarks
 * - If a parentNode is provided, positions are calculated relative to the parent's dimensions and center
 * - If no parentNode is provided, positions are calculated relative to the canvas center
 * - The function accounts for viewport zoom when calculating positions
 * - Vertical and horizontal spacing can be customized via layoutGroup or defaults to theme values
 * - Final position is adjusted for margins based on layout group settings
 */
export function getNodeInitialPosition(
  node: IAMAnyNode,
  viewport: Viewport,
  numNodes: number,
  nodeIndex: number,
  sidePanelWidth: number,
  layoutGroup: NodeLayoutGroup,
  parentNode?: IAMAnyNode // Pass the parent node if it exists
): XYPosition {
  const regularNodeMetrics = getCurrentRegularNodeMetrics();

  /**
   * Position priority: layoutGroup.position is always preferred.
   * node.data.initial_position serves as a fallback for cases where the node's
   * layout_group_id has no matching entry in the active layout groups array
   * (e.g. a stale node or a mismatched ID), preventing a silent {x:0, y:0} placement.
   */
  const initial_position = layoutGroup?.position || node.data.initial_position;
  const verticalSpacing = layoutGroup?.vertical_spacing
    ? layoutGroup.vertical_spacing * regularNodeMetrics.offsetScale
    : regularNodeMetrics.verticalSpacing;
  const horizontalSpacing = layoutGroup?.horizontal_spacing
    ? layoutGroup.horizontal_spacing * regularNodeMetrics.offsetScale
    : regularNodeMetrics.horizontalSpacing;

  if (!initial_position || !VALID_INITIAL_POSITIONS.includes(initial_position)) {
    return { x: 0, y: 0 };
  }

  const { width: nodeWidth, height: nodeHeight } = node;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Determine the center point: canvas center if no parent; parent's center if available.
  const center = parentNode
    ? getParentCenterPosition(parentNode)
    : getCanvasCenter(viewport, sidePanelWidth);

  const parentWidth = parentNode
    ? parentNode.width!
    : (windowWidth - sidePanelWidth) / viewport.zoom; // Convert to flow space
  const parentHeight = parentNode
    ? parentNode.height!
    : (windowHeight - theme.sizes.navbarHeightInPixels) / viewport.zoom; // Convert to flow space

  const isHorizontal = layoutGroup.layout_direction === 'horizontal';
  const isVertical = !isHorizontal;

  const xOffset = isHorizontal ? nodeIndex * horizontalSpacing : 0;
  const yOffset = isVertical ? nodeIndex * verticalSpacing : 0;

  // Last node has no spacing after it, so subtract it from the numNodes that gets multiplied by the spacing
  // (since the spacing includes the node height/width) and compensate by adding the node's height/width without the
  // the additional spacing itself
  const totalHorizontalWidth = (numNodes - 1) * horizontalSpacing + nodeWidth!;
  const totalVerticalHeight = (numNodes - 1) * verticalSpacing + nodeHeight!;

  const centerStartX = isVertical ? center.x - nodeWidth! / 2 : center.x - totalHorizontalWidth / 2;
  const centerStartY = isHorizontal
    ? center.y - nodeHeight! / 2
    : center.y - totalVerticalHeight / 2;

  // Subtracting 10 so that the node isn't touching the bottom-right corner of the parent
  const rightEdge = parentWidth - nodeWidth! - 10;
  const bottomEdge = parentHeight - nodeHeight! - 10;

  // Initializing with 10 so that the node isn't touching the top-left corner of the parent
  const leftEdge = 10;
  const topEdge = 10;

  const nodePositions: Record<ValidInitialPosition, XYPosition> = {
    center: { x: centerStartX + xOffset, y: centerStartY + yOffset },
    'top-left': { x: leftEdge + xOffset, y: topEdge + yOffset },
    'top-right': { x: rightEdge - xOffset, y: topEdge + yOffset },
    'top-center': { x: centerStartX + xOffset, y: topEdge + yOffset },
    'bottom-center': { x: centerStartX + xOffset, y: bottomEdge - yOffset },
    'left-center': { x: leftEdge + xOffset, y: centerStartY + yOffset },
    'right-center': { x: rightEdge - xOffset, y: centerStartY + yOffset },
    'bottom-right': { x: rightEdge - xOffset, y: bottomEdge - yOffset },
    'bottom-left': { x: leftEdge + xOffset, y: bottomEdge - yOffset },
  };

  return adjustPositionForMargin(
    nodePositions[initial_position],
    layoutGroup,
    regularNodeMetrics.offsetScale
  );
}
