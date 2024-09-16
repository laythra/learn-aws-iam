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

// TODO: Take into account the right side panel width and navbar height
function getCenterCoordinates(viewport: Viewport, sidePanelWidth: number): XYPosition {
  const { x, y, zoom } = viewport;

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth - sidePanelWidth;

  const centerX = (windowWidth / 2 - x) / zoom;
  const centerY = (windowHeight / 2 - y) / zoom;

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
    x -= (numNodes * nodeWidth) / 2; // Move nodes to the left by half of the total width
    x += nodeIndex * nodeWidth; // Move node to the right by the width of the node
    x += nodeIndex * nodeSpacing; // Add spacing between nodes
    y -= nodeHeight / 2; // Move node up by half of the height, to get its center at the center of the screen
  } else {
    // Stack nodes vertically
    y -= (numNodes * nodeHeight) / 2; // Move nodes to the top by half of the total height
    y += nodeIndex * nodeHeight; // Move node to the bottom by the height of the node
    y += nodeIndex * nodeSpacing; // Add spacing between nodes
    x -= nodeWidth / 2; // Move node to the left by half of the width, to get its center at the center of the screen
  }

  switch (initialPostion) {
    case 'center':
      return {
        ...node,
        position: { x, y },
      };
    case 'top-center':
      y /= 2; // Move node to the top by half of the top half of the screen height
      return {
        ...node,
        position: { x, y },
      };
    case 'bottom-center':
      y += y / 2; // Move node to the bottom by half of the top half of the screen height
      return {
        ...node,
        position: { x, y },
      };
    case 'left-center':
      x = x / 6;

      return {
        ...node,
        position: { x, y },
      };
    case 'right-center':
      x = window.innerWidth - sidePanelWidth - nodeWidth - x / 6;

      return {
        ...node,
        position: { x, y },
      };

    default:
      return node;
  }
}
