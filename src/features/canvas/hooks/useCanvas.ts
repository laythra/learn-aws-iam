import { useState } from 'react';

import { useSelector } from '@xstate/store/react';
import { Connection, ReactFlowInstance } from '@xyflow/react';
import _ from 'lodash';

import { useCanvasHandlers } from './useCanvasHandlers';
import { useCanvasStoreSync } from './useCanvasSync';
import { useCanvasViewport } from './useCanvasViewport';
import { CanvasStore } from '../stores/canvas-store';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

interface UseCanvasOptions {}

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
}

/**
 * A hook that manages the canvas state, including nodes, edges, and the ReactFlow instance.
 * Used only in the `Canvas` component. This hook was created to support multiple canvas components
 * that previously shared this logic. Right now, only one canvas exists, but this hook
 * keeps the logic modular and reusable for future canvases.
 *
 * @param {UseCanvasOptions} options - Options for configuring the canvas hook.
 * @returns {UseCanvasReturn} Object containing canvas state and handlers.
 */
export function useCanvas({}: UseCanvasOptions): UseCanvasReturn {
  const levelContext = LevelsProgressionContext();
  const [nodes, sidePanelOpened, edgesManagementDisabled, layoutGroups, blockedConnections] =
    levelContext.useSelector(
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

  const levelActor = levelContext.useActorRef();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<IAMAnyNode, IAMEdge>>();
  const { sidePanelWidth, adjustCanvasZoom } = useCanvasViewport({
    rfInstance,
    nodes,
    sidePanelOpened: sidePanelOpened ?? false,
  });

  useCanvasStoreSync({
    rfInstance,
    levelActor,
    layoutGroups,
    sidePanelWidth,
    adjustCanvasZoom,
  });

  const { onConnect, onEdgeDelete, onNodeDelete } = useCanvasHandlers({
    nodes,
    blockedConnections,
    edgesManagementDisabled,
    levelActor,
  });

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
  };
}
