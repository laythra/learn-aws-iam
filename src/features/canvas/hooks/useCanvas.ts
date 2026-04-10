import { useCallback, useEffect, useRef, useState } from 'react';

import { useSelector } from '@xstate/store-react';
import { Connection, ReactFlowInstance } from '@xyflow/react';
import _ from 'lodash';

import { useCanvasHandlers } from './useCanvasHandlers';
import { useCanvasStoreSync } from './useCanvasStoreSync';
import { useCanvasViewport } from './useCanvasViewport';
import { CanvasStore } from '../stores/canvas-store';
import { useLevelActor, useLevelSelector } from '@/runtime/level-runtime';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

interface UseCanvasReturn {
  rfInstance: ReactFlowInstance<IAMAnyNode, IAMEdge> | undefined;
  setRfInstance: (instance: ReactFlowInstance<IAMAnyNode, IAMEdge>) => void;
  nodesState: IAMAnyNode[];
  edgesState: IAMEdge[];
  onConnect: (params: Connection) => void;
  onEdgeDelete: (targetEdges: IAMEdge[]) => void;
  onNodeDelete: (targetNodes: IAMAnyNode[]) => void;
  sidePanelWidth: number;
  disabledEdgesCreation: boolean;
  resetCanvas: () => void;
}

/**
 * A hook that manages the canvas state, including nodes, edges, and the ReactFlow instance.
 * Used only in the `Canvas` component. This hook was created to support multiple canvas components
 * that previously shared this logic. Right now, only one canvas exists, but this hook
 * keeps the logic modular and reusable for future canvases.
 *
 * @returns {UseCanvasReturn} Object containing canvas state and handlers.
 */
export function useCanvas(): UseCanvasReturn {
  const [nodes, sidePanelOpened, edgesManagementDisabled, layoutGroups, blockedConnections] =
    useLevelSelector(
      state => [
        state.context.nodes,
        state.context.side_panel_open,
        state.context.edges_management_disabled,
        state.context.layout_groups,
        state.context.blocked_connections,
      ],
      _.isEqual
    );

  const [nodesState, edgesState] = useSelector(
    CanvasStore,
    state => [state.context.nodes, state.context.edges],
    _.isEqual
  );

  const levelActor = useLevelActor();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<IAMAnyNode, IAMEdge>>();
  const { sidePanelWidth, regularNodeBreakpointId, adjustCanvasZoom, calculateCanvasZoom } =
    useCanvasViewport({
      rfInstance,
      nodes,
      sidePanelOpened: sidePanelOpened ?? false,
    });
  const previousBreakpointId = useRef<string>();

  useCanvasStoreSync({
    rfInstance,
    levelActor,
    layoutGroups,
    sidePanelWidth,
    adjustCanvasZoom,
    calculateCanvasZoom,
  });

  const { onConnect, onEdgeDelete, onNodeDelete } = useCanvasHandlers({
    nodes,
    blockedConnections,
    edgesManagementDisabled,
    levelActor,
  });

  const resetCanvas = useCallback(() => {
    if (!rfInstance) return;

    const snapshot = levelActor.getSnapshot();
    const zoom = calculateCanvasZoom(snapshot.context.nodes);

    CanvasStore.send({
      type: 'setNodes',
      nodes: snapshot.context.nodes,
      layoutGroups,
      sidePanelWidth,
      reactFlowViewport: { x: 0, y: 0, zoom },
    });

    CanvasStore.send({
      type: 'setEdges',
      edges: snapshot.context.edges,
    });

    rfInstance.setViewport({ x: 0, y: 0, zoom }, { duration: 300 });
  }, [rfInstance, levelActor, layoutGroups, sidePanelWidth, calculateCanvasZoom]);

  useEffect(() => {
    if (!rfInstance) return;

    if (!previousBreakpointId.current) {
      previousBreakpointId.current = regularNodeBreakpointId;
      return;
    }

    if (previousBreakpointId.current === regularNodeBreakpointId) return;

    previousBreakpointId.current = regularNodeBreakpointId;

    CanvasStore.send({
      type: 'setNodes',
      nodes: nodesState,
      layoutGroups,
      sidePanelWidth,
      reactFlowViewport: rfInstance.getViewport(),
    });
  }, [regularNodeBreakpointId, rfInstance, nodesState, layoutGroups, sidePanelWidth]);

  return {
    rfInstance,
    setRfInstance,
    nodesState,
    edgesState,
    onConnect,
    onEdgeDelete,
    onNodeDelete,
    sidePanelWidth,
    disabledEdgesCreation: edgesManagementDisabled ?? false,
    resetCanvas,
  };
}
