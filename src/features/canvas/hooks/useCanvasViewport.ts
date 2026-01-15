import { useCallback, useEffect } from 'react';

import { useTheme } from '@chakra-ui/react';
import { ReactFlowInstance } from '@xyflow/react';
import _ from 'lodash';

import { useWindowWidth } from './useWindowWidth';
import { CanvasStore } from '../stores/canvas-store';
import { CustomTheme } from '@/types/custom-theme';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

interface UseCanvasViewportOptions {
  rfInstance: ReactFlowInstance<IAMAnyNode, IAMEdge> | undefined;
  nodes: IAMAnyNode[];
  sidePanelOpened: boolean;
}

interface UseCanvasViewportReturn {
  sidePanelWidth: number;
  adjustCanvasZoom: (newNodes: IAMAnyNode[]) => void;
}

export function useCanvasViewport({
  rfInstance,
  nodes,
  sidePanelOpened,
}: UseCanvasViewportOptions): UseCanvasViewportReturn {
  const theme = useTheme<CustomTheme>();
  const windowWidth = useWindowWidth();
  const sidePanelWidth = sidePanelOpened ? windowWidth * 0.2 : 0;

  const containsAccountNodes = useCallback((nodesToCheck: IAMAnyNode[]): boolean => {
    return nodesToCheck.some(node => node.data.entity === IAMNodeEntity.Account);
  }, []);

  const calculateCanvasZoom = useCallback(
    (referenceNodes: IAMAnyNode[]): number => {
      if (!rfInstance) return 1;

      const accountNodesWidth = _.sumBy(referenceNodes, node =>
        node.data.entity === IAMNodeEntity.Account ? node.width! + 20 : 0
      );
      return Math.min(
        containsAccountNodes(referenceNodes) ? (windowWidth / accountNodesWidth) * 0.9 : 1,
        1
      );
    },
    [rfInstance, containsAccountNodes]
  );

  const adjustCanvasZoom = useCallback(
    (newNodes: IAMAnyNode[]): void => {
      if (!rfInstance) return;

      const viewport = rfInstance.getViewport();

      rfInstance.setViewport(
        {
          x: viewport.x,
          y: viewport.y,
          zoom: calculateCanvasZoom(newNodes),
        },
        { duration: 0 }
      );
    },
    [rfInstance, calculateCanvasZoom]
  );

  // Used to reposition nodes when the side panel is opened, to ensure no nodes are hidden behind it
  useEffect(() => {
    if (!rfInstance || containsAccountNodes(nodes)) return;

    CanvasStore.send({
      type: 'adjustForSidePanelWidthChange',
      sidePanelWidth,
      viewport: rfInstance.getViewport(),
      nodeWidth: theme.sizes.iamNodeWidthInPixels,
    });
  }, [rfInstance, sidePanelWidth, containsAccountNodes]);

  return { sidePanelWidth, adjustCanvasZoom };
}
