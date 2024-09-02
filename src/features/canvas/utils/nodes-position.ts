import { Node, XYPosition, Viewport } from 'reactflow';

import { theme } from '@/theme';
import { IAMAnyNodeData } from '@/types';

const VALID_INITIAL_POSITIONS = ['center'];

export function getNodeWithInitialPosition(
  node: Node<IAMAnyNodeData>,
  viewport: Viewport,
  numNodes: number,
  nodeIndex: number
): Node<IAMAnyNodeData> {
  const {
    data: { initial_position: initialPostion },
  } = node;

  const { x, y, zoom } = viewport;

  if (!initialPostion || !VALID_INITIAL_POSITIONS.includes(initialPostion)) {
    return node;
  }

  if (initialPostion === 'center') {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const nodeWidth = theme.sizes.iamNodeWidthInPixels;
    const nodeHeight = theme.sizes.iamNodeHeightInPixels;
    const nodeSpacing = 20;

    const centerX =
      (windowWidth / 2 - x) / zoom -
      (numNodes * nodeWidth) / 2 +
      nodeIndex * nodeWidth +
      nodeSpacing * nodeIndex;
    const centerY = (windowHeight / 2 - y) / zoom - nodeHeight / 2;

    const position: XYPosition = {
      x: centerX,
      y: centerY,
    };
    return {
      ...node,
      position: position,
    };
  } else {
    return node;
  }
}
