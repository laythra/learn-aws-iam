import { XYPosition, Viewport } from '@xyflow/react';

import { theme } from '@/theme';
import { IAMAnyNode, IAMNodeEntity } from '@/types/iam-node-types';

const BETWEEN_NODES_SPACING = 20;
const VALID_INITIAL_POSITIONS = [
  'center',
  'top-center',
  'bottom-center',
  'left-center',
  'right-center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

/**
 * Returns the size for the given node.
 * For instance, Account nodes have a larger size.
 */
function getNodeSize(node: IAMAnyNode): { width: number; height: number } {
  const { entity } = node.data;
  if (entity === IAMNodeEntity.Account) {
    return {
      width: 800,
      height: 300,
    };
  }
  return {
    width: theme.sizes.iamNodeWidthInPixels,
    height: theme.sizes.iamNodeHeightInPixels,
  };
}

/**
 * When a node has no parent, we calculate its center relative to the canvas.
 */
function getCanvasCenter(viewport: Viewport, sidePanelWidth: number): XYPosition {
  const { x, y, zoom } = viewport;
  const navbarHeight = theme.sizes.navbarHeightInPixels;
  const centerX = (window.innerWidth - sidePanelWidth) / 2 / zoom - x;
  const centerY = (window.innerHeight - navbarHeight) / 2 / zoom - y;
  return { x: centerX, y: centerY };
}

/**
 * When a node is inside a parent, we calculate the center of the parent node.
 * In the parent's coordinate system, (0,0) is the top-left.
 */
function getParentCenterPosition(parentNode: IAMAnyNode): XYPosition {
  const parentSize = getNodeSize(parentNode);
  return {
    x: parentSize.width / 2,
    y: parentSize.height / 2,
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
  parentNode?: IAMAnyNode // Pass the parent node if it exists
): XYPosition {
  const { initial_position } = node.data;
  if (!initial_position || !VALID_INITIAL_POSITIONS.includes(initial_position)) {
    return { x: 0, y: 0 };
  }

  const { width: nodeWidth, height: nodeHeight } = getNodeSize(node);
  const navbarHeight = theme.sizes.navbarHeightInPixels;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Determine the center point: canvas center if no parent; parent's center if available.
  const center = parentNode
    ? getParentCenterPosition(parentNode)
    : getCanvasCenter(viewport, sidePanelWidth);

  // Start with the center coordinates
  let x = center.x;
  let y = center.y - nodeHeight / 2;

  // If we are stacking nodes horizontally (for positions like center, top-center, bottom-center)
  // we spread them out along the horizontal axis.
  if (['center', 'top-center', 'bottom-center'].includes(initial_position)) {
    const totalWidth = numNodes * nodeWidth + (numNodes - 1) * BETWEEN_NODES_SPACING;
    x = center.x - totalWidth / 2 + nodeIndex * (nodeWidth + BETWEEN_NODES_SPACING);
  } else {
    // Otherwise, we stack vertically.
    const totalHeight = numNodes * nodeHeight + (numNodes - 1) * BETWEEN_NODES_SPACING;
    y = center.y - totalHeight / 2 + nodeIndex * (nodeHeight + BETWEEN_NODES_SPACING);
  }

  // Override x or y based on the specific initial_position setting.
  if (initial_position === 'top-center') {
    y = BETWEEN_NODES_SPACING;
  } else if (initial_position === 'bottom-center') {
    y = parentNode
      ? getNodeSize(parentNode).height - nodeHeight - BETWEEN_NODES_SPACING
      : windowHeight - nodeHeight - BETWEEN_NODES_SPACING - navbarHeight;
  } else if (initial_position === 'left-center') {
    x = BETWEEN_NODES_SPACING;
  } else if (initial_position === 'right-center') {
    x = parentNode
      ? getNodeSize(parentNode).width - nodeWidth - BETWEEN_NODES_SPACING
      : windowWidth - sidePanelWidth - nodeWidth - BETWEEN_NODES_SPACING;
  } else if (initial_position === 'top-left') {
    x = BETWEEN_NODES_SPACING;
    y = BETWEEN_NODES_SPACING;
  } else if (initial_position === 'top-right') {
    x = parentNode
      ? getNodeSize(parentNode).width - nodeWidth - BETWEEN_NODES_SPACING
      : windowWidth - sidePanelWidth - nodeWidth - BETWEEN_NODES_SPACING;
    y = BETWEEN_NODES_SPACING;
  } else if (initial_position === 'bottom-left') {
    x = BETWEEN_NODES_SPACING;
    y = parentNode
      ? getNodeSize(parentNode).height - nodeHeight - BETWEEN_NODES_SPACING
      : windowHeight - nodeHeight - BETWEEN_NODES_SPACING - navbarHeight;
  } else if (initial_position === 'bottom-right') {
    x = parentNode
      ? getNodeSize(parentNode).width - nodeWidth - BETWEEN_NODES_SPACING
      : windowWidth - sidePanelWidth - nodeWidth - BETWEEN_NODES_SPACING;
    y = parentNode
      ? getNodeSize(parentNode).height - nodeHeight - BETWEEN_NODES_SPACING
      : windowHeight - nodeHeight - BETWEEN_NODES_SPACING - navbarHeight;
  }

  return { x, y };
}
