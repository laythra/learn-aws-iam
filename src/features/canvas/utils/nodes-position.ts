import { Node, XYPosition, Viewport } from 'reactflow';

import { theme } from '@/theme';
import { IAMAnyNodeData } from '@/types';

const VALID_INITIAL_POSITIONS = ['center'];

export function getNodeWithInitialPosition(
  node: Node<IAMAnyNodeData>,
  viewport: Viewport
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

    const centerX = (windowWidth / 2 - x) / zoom - theme.sizes.iamNodeWidthInPixels / 2;
    const centerY = (windowHeight / 2 - y) / zoom - theme.sizes.iamNodeHeightInPixels / 2;

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
