import { XYPosition, Viewport } from '@xyflow/react';

import { theme } from '@/theme';
import { IAMAnyNode, NodeLayoutGroup } from '@/types/iam-node-types';

export const BETWEEN_NODES_SPACING = 20;
export const VALID_INITIAL_POSITIONS = [
  'center',
  'top-center',
  'bottom-center',
  'left-center',
  'right-center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const;

export const LAYOUT_DIRECTIONS = ['horizontal', 'vertical'] as const;

export type ValidInitialPosition = (typeof VALID_INITIAL_POSITIONS)[number];
export type LayoutDirection = (typeof LAYOUT_DIRECTIONS)[number];

// Should we memoize this?
const calculateNodePositions = (
  originX: number,
  originY: number,
  verticalSpacing: number,
  horizontalSpacing: number,
  nodeWidth: number,
  nodeHeight: number,
  parentHeight: number,
  parentWidth: number,
  nodeIndex: number,
  numNodes: number,
  layoutDirection: LayoutDirection = 'vertical'
): Record<ValidInitialPosition, { x: number; y: number }> => {
  const isHorizontal = layoutDirection === 'horizontal';
  const isVertical = !isHorizontal;

  const totalHorizontalSpace = nodeWidth + (numNodes - 1) * horizontalSpacing;
  const totalVerticalSpace = nodeHeight + (numNodes - 1) * verticalSpacing;

  const xOffset = isHorizontal ? nodeIndex * horizontalSpacing : 0;
  const yOffset = isVertical ? nodeIndex * verticalSpacing : 0;

  const centerStartX = isVertical ? originX - nodeWidth / 2 : originX - totalHorizontalSpace / 2;
  const centerStartY = isHorizontal ? originY - nodeHeight / 2 : originY - totalVerticalSpace / 2;

  // Subtracting 10 so that the node isn't touching the bottom-right corner of the parent
  const rightEdge = parentWidth - nodeWidth - 10;
  const bottomEdge = parentHeight - nodeHeight - 10;

  // Initializing with 10 so that the node isn't touching the top-left corner of the parent
  const leftEdge = 10;
  const topEdge = 10;

  return {
    center: {
      x: centerStartX + xOffset,
      y: centerStartY + yOffset,
    },
    'top-left': {
      x: leftEdge + xOffset,
      y: topEdge + yOffset,
    },
    'top-right': {
      x: rightEdge - xOffset,
      y: topEdge + yOffset,
    },
    'top-center': {
      x: centerStartX + xOffset,
      y: topEdge + yOffset,
    },
    'bottom-center': {
      x: centerStartX + xOffset,
      y: bottomEdge - yOffset,
    },
    'left-center': {
      x: leftEdge + xOffset,
      y: centerStartY + yOffset,
    },
    'right-center': {
      x: rightEdge - xOffset,
      y: centerStartY + yOffset,
    },
    'bottom-right': {
      x: rightEdge - xOffset,
      y: bottomEdge - yOffset,
    },
    'bottom-left': {
      x: leftEdge + xOffset,
      y: bottomEdge - yOffset,
    },
  };
};

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
function adjustPositionForMargin(position: XYPosition, layoutGroup: NodeLayoutGroup): XYPosition {
  if (!layoutGroup.margin) return position;

  return {
    x: position.x + (layoutGroup.margin.left || 0),
    y: position.y + (layoutGroup.margin.top || 0),
  };
}

/**
 * Calculates the initial position for a node.
 *
 * If a parent node is provided, the position is computed relative to the parent.
 * Otherwise, it is computed relative to the canvas.
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
  const initial_position = layoutGroup?.position || node.data.initial_position;
  const verticalSpacing =
    layoutGroup?.vertical_spacing ?? theme.sizes.iamNodeHeightInPixels + BETWEEN_NODES_SPACING;
  const horizontalSpacing =
    layoutGroup?.horizontal_spacing ?? theme.sizes.iamNodeWidthInPixels + BETWEEN_NODES_SPACING;

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

  const nodePosition = calculateNodePositions(
    center.x,
    center.y,
    verticalSpacing,
    horizontalSpacing,
    nodeWidth!,
    nodeHeight!,
    parentHeight,
    parentWidth,
    nodeIndex,
    numNodes,
    layoutGroup.layout_direction
  )[initial_position];

  return adjustPositionForMargin(nodePosition, layoutGroup);
}
