import { useCallback, useEffect, useState } from 'react';

import { useTheme, useToast } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { ReactFlowInstance, Connection } from '@xyflow/react';
import _ from 'lodash';

import { CanvasStore } from '../stores/canvas-store';
import { isValidConnection } from '../utils/edges-creation';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { CustomTheme } from '@/types/custom-theme';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

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
 * that previously shared this logic.
 * @returns {UseCanvasReturn} Object containing canvas state and handlers.
 */
export function useCanvas({}: UseCanvasOptions): UseCanvasReturn {
  const theme = useTheme<CustomTheme>();
  const toast = useToast();
  const [nodes, sidePanelOpened, edgesManagementDisabled, layoutGroups, blockedConnections] =
    LevelsProgressionContext().useSelector(
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

  const levelActor = LevelsProgressionContext().useActorRef();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<IAMAnyNode, IAMEdge>>();

  const sidePanelWidth = sidePanelOpened ? window.innerWidth * 0.2 : 0;

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
        containsAccountNodes(referenceNodes) ? (window.innerWidth / accountNodesWidth) * 0.9 : 1,
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

  // This useEffect initializes the canvas store with nodes and edges from the state machine when the React Flow instance becomes available.
  // We need this initialization because event-driven updates alone aren't sufficient, as events may fire before this hook is set up, causing us to miss them.
  useEffect(() => {
    if (!rfInstance) return;

    const snapshot = levelActor.getSnapshot();

    adjustCanvasZoom(snapshot.context.nodes);

    CanvasStore.send({
      type: 'setNodes',
      nodes: snapshot.context.nodes,
      layoutGroups,
      sidePanelWidth,
      reactFlowViewport: rfInstance.getViewport(),
    });

    CanvasStore.send({
      type: 'setEdges',
      edges: snapshot.context.edges,
    });
  }, [levelActor, rfInstance, adjustCanvasZoom]);

  // This useEffect sets up subscriptions to the level actor to listen for node and edge changes.
  // It acts as the synchronization layer between the state machine and the canvas store.
  // Each event is handled separately to make integrating animations easier in the future.
  // For example, when edges are deleted, we might wanna trigger a fade-out animation before actually removing them from the state.
  // Therefore, we separate the "mark for deletion" and "finalize deletion" steps.
  useEffect(() => {
    if (!rfInstance) return;

    const edgesDeletedSub = levelActor.on('EDGES_DELETED', ({ edgeIds }: { edgeIds: string[] }) => {
      // The deletion process for edges is split into two steps:
      // 1. Mark edges for deletion (this is where we can trigger animations)
      // 2. Finalize edges deletion (actually remove them from the state, happens after animation completes)
      CanvasStore.send({ type: 'markEdgesForDeletion', edgeIds });
    });

    const nodesDeletedSub = levelActor.on('NODES_DELETED', ({ nodeIds }: { nodeIds: string[] }) => {
      CanvasStore.send({ type: 'markNodesForDeletion', nodeIds });
    });

    const edgesAddedSub = levelActor.on(
      'EDGES_ADDED',
      ({ edges: newEdges }: { edges: IAMEdge[] }) => {
        CanvasStore.send({ type: 'addEdges', edges: newEdges });
      }
    );

    const nodesAddedSub = levelActor.on(
      'NODES_ADDED',
      ({ nodes: newNodes }: { nodes: IAMAnyNode[] }) => {
        CanvasStore.send({
          type: 'addNodes',
          nodes: newNodes,
          layoutGroups,
          sidePanelWidth,
          reactFlowViewport: rfInstance.getViewport(),
        });
      }
    );

    const edgesResetSub = levelActor.on(
      'EDGES_RESET',
      ({ edges: newEdges }: { edges: IAMEdge[] }) => {
        CanvasStore.send({ type: 'setEdges', edges: newEdges });
      }
    );

    const nodesResetSub = levelActor.on(
      'NODES_RESET',
      ({ nodes: newNodes }: { nodes: IAMAnyNode[] }) => {
        adjustCanvasZoom(newNodes);

        CanvasStore.send({
          type: 'setNodes',
          nodes: newNodes,
          layoutGroups,
          sidePanelWidth,
          reactFlowViewport: rfInstance.getViewport(),
        });
      }
    );

    const nodeUpdatedSub = levelActor.on('NODE_UPDATED', ({ node }: { node: IAMAnyNode }) => {
      CanvasStore.send({ type: 'updateNodeData', node });
    });

    return () => {
      edgesDeletedSub.unsubscribe();
      edgesAddedSub.unsubscribe();
      edgesResetSub.unsubscribe();
      nodesDeletedSub.unsubscribe();
      nodesAddedSub.unsubscribe();
      nodesResetSub.unsubscribe();
      nodeUpdatedSub.unsubscribe();
    };
  }, [levelActor, rfInstance, sidePanelWidth, adjustCanvasZoom, layoutGroups]);

  // Used to reposition nodes when the side panel is opened, to ensure no nodes are hidden behind it
  useEffect(() => {
    if (!rfInstance || containsAccountNodes(nodes)) return;

    CanvasStore.send({
      type: 'adjustForSidePanelWidthChange',
      sidePanelWidth,
      viewport: rfInstance.getViewport(),
      nodeWidth: theme.sizes.iamNodeWidthInPixels,
    });
  }, [sidePanelWidth, containsAccountNodes]);

  const showInvalidConnectionToast = useCallback(() => {
    toast({
      title: 'Invalid Connection',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }, []);

  const showInsufficientPermissionsToast = useCallback(() => {
    toast({
      title: 'Insufficient Permissions to Create Connection',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }, []);

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

      // TODO: Consider sending only node IDs instead of full node objects, and let the state machine look them up.
      // This would simplify internal state machine events where full node data may not be readily available.
      const sourceNode = _.find<IAMAnyNode>(nodes, { id: params.source })!;
      const targetNode = _.find<IAMAnyNode>(nodes, { id: params.target })!;

      if (!isValidConnection(sourceNode, targetNode)) {
        showInvalidConnectionToast();
        return;
      }

      const isBlockedConnection = blockedConnections?.some(blockedConn => {
        return blockedConn.from === sourceNode.id && blockedConn.to === targetNode.id;
      });

      if (isBlockedConnection) {
        showInsufficientPermissionsToast();
        return;
      }

      levelActor.send({
        type: StatefulStateMachineEvent.ConnectNodes,
        sourceNode,
        targetNode,
      });
    },
    [nodes, edgesManagementDisabled, blockedConnections]
  );

  const onEdgeDelete = useCallback((targetEdges: IAMEdge[]) => {
    levelActor.send({ type: StatefulStateMachineEvent.DeleteEdge, edge: targetEdges[0] });
  }, []);

  const onNodeDelete = useCallback((targetNodes: IAMAnyNode[]) => {
    levelActor.send({ type: StatefulStateMachineEvent.DeleteNode, node: targetNodes[0] });
  }, []);

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
