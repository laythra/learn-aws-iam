import { useCallback, useEffect } from 'react';

import { ReactFlowInstance } from '@xyflow/react';
import _ from 'lodash';

import { useWindowSize } from './useWindowSize';
import { CanvasStore } from '../stores/canvas-store';
import { getRegularNodeMetrics, NodeSizingBreakpointID } from '@/domain/node-metrics';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

interface UseCanvasViewportOptions {
  rfInstance: ReactFlowInstance<IAMAnyNode, IAMEdge> | undefined;
  nodes: IAMAnyNode[];
  sidePanelOpened: boolean;
}

interface UseCanvasViewportReturn {
  sidePanelWidth: number;
  regularNodeBreakpointId: NodeSizingBreakpointID;
  adjustCanvasZoom: (newNodes: IAMAnyNode[]) => void;
}

export function useCanvasViewport({
  rfInstance,
  nodes,
  sidePanelOpened,
}: UseCanvasViewportOptions): UseCanvasViewportReturn {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const regularNodeMetrics = getRegularNodeMetrics(windowWidth, windowHeight);
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
    [rfInstance, containsAccountNodes, windowWidth]
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
      nodeWidth: regularNodeMetrics.nodeWidth,
    });
  }, [rfInstance, sidePanelWidth, containsAccountNodes, regularNodeMetrics.nodeWidth]);

  return {
    sidePanelWidth,
    regularNodeBreakpointId: regularNodeMetrics.breakpointId,
    adjustCanvasZoom,
  };
}
