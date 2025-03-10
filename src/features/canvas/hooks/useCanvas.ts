import { useCallback, useEffect, useState } from 'react';

import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import { Edge, ReactFlowInstance, Node, Connection } from 'reactflow';

import { CanvasStore } from '../stores/canvas-store';
import { isValidConnection } from '../utils/edges-creation';
import { getNodeInitialPosition } from '../utils/nodes-position';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { CustomTheme, IAMAnyNodeData, IAMEdgeData } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

interface UseCanvasOptions {}

interface UseCanvasReturn {
  rfInstance: ReactFlowInstance | undefined;
  setRfInstance: (instance: ReactFlowInstance) => void;
  nodesState: Node<IAMAnyNodeData>[];
  edgesState: Edge[];
  onConnect: (params: Connection) => void;
  onEdgeDelete: (targetEdges: Edge[]) => void;
  sidePanelWidth: number;
  disabledEdgesCreation: boolean;
}

/**
 * A hook that's responsible for managing the canvas state, which includes nodes, edges, and the ReactFlow instance.
 * Used in both Canvas.tsx and MultiAccountCanvas.tsx
 *  @returns {UseCanvasReturn} Object containing canvas state and handlers.
 */
export function useCanvas({}: UseCanvasOptions): UseCanvasReturn {
  const theme = useTheme<CustomTheme>();
  const [nodes, edges, sidePanelOpened, edgesManagementDisabled] =
    LevelsProgressionContext().useSelector(
      state => [
        state.context.nodes,
        state.context.edges,
        state.context.side_panel_open,
        state.context.edges_management_disabled,
      ],
      _.isEqual
    );

  const [nodesState, edgesState] = useSelector(
    CanvasStore,
    state => [state.context.nodes, state.context.edges],
    _.isEqual
  );

  const levelActor = LevelsProgressionContext().useActorRef();
  const sidePanelWidth = sidePanelOpened ? window.innerWidth * 0.2 : 0;

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  useEffect(() => {
    CanvasStore.send({ type: 'setEdges', edges });
  }, [edges]);

  useEffect(() => {
    if (!rfInstance) return;

    const nodeWidth = theme.sizes.iamNodeWidthInPixels;
    const sidePanelPos = rfInstance.screenToFlowPosition({
      x: window.innerWidth - sidePanelWidth,
      y: 0,
    });

    const newNodesState = nodesState.map(node => {
      if (node.position.x + nodeWidth >= sidePanelPos.x) {
        const newNodePosX = sidePanelPos.x - 10 - nodeWidth;
        return { ...node, position: { ...node.position, x: newNodePosX } };
      }

      return node;
    });

    CanvasStore.send({ type: 'setNodes', nodes: newNodesState });
  }, [sidePanelOpened]);

  useEffect(() => {
    if (!rfInstance) return;

    const reactFlowViewport = rfInstance.getViewport();
    const nodeGroups = _.groupBy(nodes, 'data.initial_position');

    const newNodes = Object.values(nodeGroups).flatMap(nodesGroup => {
      return nodesGroup.map((node, nodeIndex) => {
        const existingNode = _.find(nodesState, { id: node.id });

        // Ensures existing nodes' position remains unchanged
        // since the user might have moved them and we don't want to override that
        if (existingNode) {
          return {
            ...existingNode,
            data: { ...existingNode.data, ...node.data },
            position: existingNode.position,
          };
        }

        const initialPosition = getNodeInitialPosition(
          node,
          reactFlowViewport,
          nodesGroup.length,
          nodeIndex,
          sidePanelWidth
        );

        return { ...node, position: initialPosition };
      });
    });

    CanvasStore.send({ type: 'setNodes', nodes: newNodes });
  }, [nodes, rfInstance]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (
        params.source === params.target ||
        !params.source ||
        !params.target ||
        edgesManagementDisabled
      ) {
        return;
      }

      const sourceNode = _.find<Node<IAMAnyNodeData>>(nodes, { id: params.source })!;
      const targetNode = _.find<Node<IAMAnyNodeData>>(nodes, { id: params.target })!;

      if (!isValidConnection(sourceNode, targetNode)) {
        return;
      }

      levelActor.send({
        type: StatefulStateMachineEvent.ConnectNodes,
        sourceNode,
        targetNode,
      });
    },
    [nodes, edgesManagementDisabled]
  );

  const onEdgeDelete = useCallback((targetEdges: Edge<IAMEdgeData>[]) => {
    levelActor.send({ type: 'DELETE_EDGE', edge: targetEdges[0] });
  }, []);

  // TODO: Save flow state to local storage?
  // useEffect(() => {
  //   if (rfInstance && levelFinished) {
  //     const flowState = rfInstance.toObject();
  //     storage.setKey('flow_state', JSON.stringify(flowState));
  //   }
  // }, [levelFinished]);

  return {
    rfInstance,
    setRfInstance,
    nodesState,
    edgesState,
    onConnect,
    onEdgeDelete,
    sidePanelWidth,
    disabledEdgesCreation: edgesManagementDisabled ?? false,
  };
}
