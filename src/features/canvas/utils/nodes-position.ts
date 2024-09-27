import { Node, XYPosition, Viewport } from 'reactflow';

import { theme } from '@/theme';
import { IAMAnyNodeData } from '@/types';

const VALID_INITIAL_POSITIONS = [
  'center',
  'top-center',
  'bottom-center',
  'left-center',
  'right-center',
];

const BETWEEN_NODES_SPACING = 20;

function getCenterCoordinates(viewport: Viewport, sidePanelWidth: number): XYPosition {
  const { x, y, zoom } = viewport;

  const navbarHeight = theme.sizes.navbarHeightInPixels;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth - sidePanelWidth;

  const centerX = (windowWidth / 2 - x) / zoom;
  const centerY = (windowHeight / 2 - y) / zoom + navbarHeight / 2;

  return {
    x: centerX,
    y: centerY,
  };
}

export function getNodeWithInitialPosition(
  node: Node<IAMAnyNodeData>,
  viewport: Viewport,
  numNodes: number,
  nodeIndex: number,
  sidePanelWidth: number
): Node<IAMAnyNodeData> {
  const {
    data: { initial_position: initialPostion },
  } = node;

  if (!initialPostion || !VALID_INITIAL_POSITIONS.includes(initialPostion)) {
    return node;
  }

  const nodeWidth = theme.sizes.iamNodeWidthInPixels;
  const nodeHeight = theme.sizes.iamNodeHeightInPixels;
  const centerCoordinates = getCenterCoordinates(viewport, sidePanelWidth);
  const nodeSpacing = 20;

  let { x, y } = centerCoordinates;

  // Stack nodes horizontally
  if (['center', 'top-center', 'bottom-center'].includes(initialPostion)) {
    // Move nodes to the left by half of the total width
    x -= (numNodes * nodeWidth + (numNodes - 1) * BETWEEN_NODES_SPACING) / 2;
    // Move node to the right by the width of the node
    x += nodeIndex * nodeWidth;
    // Add spacing between nodes
    x += nodeIndex * BETWEEN_NODES_SPACING;
  } else {
    // Stack nodes vertically

    // Move nodes to the top by half of the total height
    y -= (numNodes * nodeHeight + (numNodes - 1) * BETWEEN_NODES_SPACING) / 2;
    // Move node to the bottom by the height of the node
    y += nodeIndex * nodeHeight;
    // Add spacing between nodes
    y += nodeIndex * nodeSpacing;
  }

  switch (initialPostion) {
    case 'center':
      y -= nodeHeight / 2; // Move node up by half of the height, to get its center at the center of the screen
      return {
        ...node,
        position: { x, y },
      };
    case 'top-center':
      y = theme.sizes.navbarHeightInPixels + nodeSpacing;
      return {
        ...node,
        position: { x, y },
      };
    case 'bottom-center':
      y = window.innerHeight - theme.sizes.iamNodeHeightInPixels - nodeSpacing;
      return {
        ...node,
        position: { x, y },
      };
    case 'left-center':
      x = nodeSpacing;

      return {
        ...node,
        position: { x, y },
      };
    case 'right-center':
      x = window.innerWidth - sidePanelWidth - nodeWidth - nodeSpacing;

      return {
        ...node,
        position: { x, y },
      };

    default:
      return node;
  }
}
