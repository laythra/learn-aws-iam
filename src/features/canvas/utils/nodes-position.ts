import { Node, XYPosition, Viewport } from 'reactflow';

import { theme } from '@/theme';
import { IAMAnyNodeData } from '@/types';

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

const BETWEEN_NODES_SPACING = 20;

function getCenterCoordinates(viewport: Viewport, sidePanelWidth: number): XYPosition {
  const { x, y, zoom } = viewport;
  const navbarHeight = theme.sizes.navbarHeightInPixels;
  const centerX = (window.innerWidth - sidePanelWidth) / 2 / zoom - x;
  // Subtract navbarHeight because the canvas already has top padding equal to the navbar's height
  const centerY = (window.innerHeight - navbarHeight) / 2 / zoom - y - navbarHeight;
  return { x: centerX, y: centerY };
}

export function getNodeInitialPosition(
  node: Node<IAMAnyNodeData>,
  viewport: Viewport,
  numNodes: number,
  nodeIndex: number,
  sidePanelWidth: number
): XYPosition {
  const { initial_position } = node.data;
  if (!initial_position || !VALID_INITIAL_POSITIONS.includes(initial_position)) {
    return { x: 0, y: 0 };
  }

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const navbarHeight = theme.sizes.navbarHeightInPixels;
  const nodeWidth = theme.sizes.iamNodeWidthInPixels;
  const nodeHeight = theme.sizes.iamNodeHeightInPixels;
  const center = getCenterCoordinates(viewport, sidePanelWidth);

  // Start with the center coordinates
  let x = center.x;
  let y = center.y;

  // If we are stacking nodes horizontally, adjust x accordingly
  if (['center', 'top-center', 'bottom-center'].includes(initial_position)) {
    const totalWidth = numNodes * nodeWidth + (numNodes - 1) * BETWEEN_NODES_SPACING;
    x = center.x - totalWidth / 2 + nodeIndex * (nodeWidth + BETWEEN_NODES_SPACING);
  } else {
    const totalHeight = numNodes * nodeHeight + (numNodes - 1) * BETWEEN_NODES_SPACING;
    y = center.y - totalHeight / 2 + nodeIndex * (nodeHeight + BETWEEN_NODES_SPACING);
  }

  // Override x or y based on the specific initial_position
  switch (initial_position) {
    case 'top-center':
      y = BETWEEN_NODES_SPACING;
      break;
    case 'bottom-center':
      y = windowHeight - nodeHeight - BETWEEN_NODES_SPACING - navbarHeight;
      break;
    case 'left-center':
      x = BETWEEN_NODES_SPACING;
      break;
    case 'right-center':
      x = windowWidth - sidePanelWidth - nodeWidth - BETWEEN_NODES_SPACING;
      break;
    case 'top-left':
      x = BETWEEN_NODES_SPACING;
      y = BETWEEN_NODES_SPACING;
      break;
    case 'top-right':
      x = windowWidth - sidePanelWidth - nodeWidth - BETWEEN_NODES_SPACING;
      y = BETWEEN_NODES_SPACING;
      break;
    case 'bottom-left':
      x = BETWEEN_NODES_SPACING;
      y = windowHeight - nodeHeight - BETWEEN_NODES_SPACING - navbarHeight;
      break;
    case 'bottom-right':
      x = windowWidth - sidePanelWidth - nodeWidth - BETWEEN_NODES_SPACING;
      y = windowHeight - nodeHeight - BETWEEN_NODES_SPACING - navbarHeight;
      break;
    // 'center' falls through with the horizontal stacking calculated above
  }

  return { x, y };
}
