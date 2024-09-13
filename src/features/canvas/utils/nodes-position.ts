import { Node, XYPosition, Viewport } from 'reactflow';

import { theme } from '@/theme';
import { IAMAnyNodeData } from '@/types';

const VALID_INITIAL_POSITIONS = ['center', 'top-center'];

// TODO: Take into account the right side panel width and navbar height
function getCenterCoordinates(viewport: Viewport): XYPosition {
  const { x, y, zoom } = viewport;

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

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
  nodeIndex: number
): Node<IAMAnyNodeData> {
  const {
    data: { initial_position: initialPostion },
  } = node;

  if (!initialPostion || !VALID_INITIAL_POSITIONS.includes(initialPostion)) {
    return node;
  }

  const nodeWidth = theme.sizes.iamNodeWidthInPixels;
  const nodeHeight = theme.sizes.iamNodeHeightInPixels;
  const centerCoordinates = getCenterCoordinates(viewport);
  const nodeSpacing = 20;

  let { x, y } = centerCoordinates;

  switch (initialPostion) {
    case 'center':
      x -= (numNodes * nodeWidth) / 2; // Move nodes to the left by half of the total width
      x += nodeIndex * nodeWidth; // Move node to the right by the width of the node
      x += nodeIndex * nodeSpacing; // Add spacing between nodes

      y -= nodeHeight / 2; // Move node up by half of the height

      return {
        ...node,
        position: { x, y },
      };
    case 'top-center':
      x -= (numNodes * nodeWidth) / 2; // Move nodes to the left by half of the total width
      x += nodeIndex * nodeWidth; // Move node to the right by the width of the node
      x += nodeIndex * nodeSpacing; // Add spacing between nodes

      y /= 2; // Move node to the top by half of the top half of the screen height
      return {
        ...node,
        position: { x, y },
      };
    default:
      return node;
  }
}
