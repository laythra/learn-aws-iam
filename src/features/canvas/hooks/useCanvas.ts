import { useCallback, useEffect, useState } from 'react';

import { useTheme, useToast } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { ReactFlowInstance, Connection } from '@xyflow/react';
import _ from 'lodash';

import { CanvasStore } from '../stores/canvas-store';
import { isValidConnection } from '../utils/edges-creation';
import { getNodeInitialPosition } from '../utils/nodes-position';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { createHorizontalGroup } from '@/factories/layout-group-factory';
import { CustomTheme } from '@/types';
import { IAMAnyNode, IAMEdge, IAMNodeEntity } from '@/types/iam-node-types';
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
  initialZoom: number;
}

const DEFAULT_LAYOUT_GROUP = createHorizontalGroup('default-layout-group', 'center', 10, {
  top: 100,
  left: 100,
});

/**
 * A hook that's responsible for managing the canvas state, which includes nodes, edges, and the ReactFlow instance.
 * Used in both Canvas and MultiAccountCanvas
 *  @returns {UseCanvasReturn} Object containing canvas state and handlers.
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

  const hasAccountNodes = nodes.some(node => node.data.entity === IAMNodeEntity.Account);
  const accountNodesWidth = _.sumBy(nodes, node =>
    node.data.entity === IAMNodeEntity.Account ? node.width! + 20 : 0
  );

  // If there are account nodes, set initial zoom to fit them within the viewport width
  const initialZoom = Math.min(
    hasAccountNodes ? (window.innerWidth / accountNodesWidth) * 0.9 : 1,
    1
  );

  const levelActor = LevelsProgressionContext().useActorRef();
  const sidePanelWidth = sidePanelOpened ? window.innerWidth * 0.2 : 0;

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<IAMAnyNode, IAMEdge>>();

  useEffect(() => {
    const snapshot = levelActor.getSnapshot();

    CanvasStore.send({
      type: 'setEdges',
      edges: snapshot.context.edges,
    });

    const edgesDeletedSub = levelActor.on('EDGES_DELETED', ({ edgeIds }: { edgeIds: string[] }) => {
      // TODO: What we really want here is to have a two-step deletion process for edges:
      // 1. Mark edges for deletion (this is where we can trigger animations)
      // 2. Finalize edges deletion (actually remove them from the state, happens after animation completes)

      // CanvasStore.send({ type: 'markEdgesForDeletion', edgeIds });
      CanvasStore.send({ type: 'finalizeEdgesDeletion', edgeIds });
    });

    const edgesAddedSub = levelActor.on(
      'EDGES_ADDED',
      ({ edges: newEdges }: { edges: IAMEdge[] }) => {
        CanvasStore.send({ type: 'addEdges', edges: newEdges });
      }
    );

    const edgesResetSub = levelActor.on(
      'EDGES_RESET',
      ({ edges: newEdges }: { edges: IAMEdge[] }) => {
        CanvasStore.send({ type: 'setEdges', edges: newEdges });
      }
    );

    return () => {
      edgesDeletedSub.unsubscribe();
      edgesAddedSub.unsubscribe();
      edgesResetSub.unsubscribe();
    };
  }, [levelActor]);

  // Used to reposition nodes when the side panel is opened, to ensure no nodes are hidden behind it
  useEffect(() => {
    if (!rfInstance || hasAccountNodes) return;

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

  // Adds newly added nodes to the canvas with their initial positions
  // TODO: This useEffect is easily the smelliest useEffect of the codebase.
  // i'm relying on react's "accidental" re-runs of useEffect to detect newly added nodes,
  // which is very fragile and can easily break in the future.
  // A better approach would be to have a dedicated event that gets emitted
  // that notifies about newly added nodes, and listen to that event instead.
  // The event should be purely Domain driven, like "NODE_ADDED" or "NODES_DELETED"
  // In such events, diffing would no longer be necessary since we would receive
  // the exact nodes that were added/removed.
  // Plus, testing this is a nightmare as of now.
  useEffect(() => {
    if (!rfInstance) return;

    const layoutGroupsById = _.keyBy(layoutGroups, 'id');
    const reactFlowViewport = rfInstance.getViewport();

    // This section organizes nodes into groups based on their relationships.
    // Nodes with a parent are grouped separately, as are account nodes.
    const nodeGroups = _.groupBy(nodes, node => {
      const isAccountNode = node.data.entity === IAMNodeEntity.Account;
      const hasParent = !!node.parentId;

      if (hasParent) {
        return `child-${node.parentId}-${node.data.layout_group_id}`;
      }

      if (isAccountNode) {
        return `account-${node.data.layout_group_id}`;
      }

      return node.data.layout_group_id;
    });

    const nodeById = _.keyBy(nodes, 'id');

    const newNodes = Object.values(nodeGroups).flatMap(nodesGroup => {
      return nodesGroup.map((node, nodeIndex) => {
        const existingNode = _.find(nodesState, { id: node.id });
        const layoutGroup = layoutGroupsById[node.data.layout_group_id];
        const parentNode = node.parentId ? nodeById[node.parentId] : undefined;

        // Ensures existing nodes' positions remain unchanged
        // since the user might have moved them and we don't want to override that
        if (existingNode) {
          return {
            ...existingNode,
            data: { ...existingNode.data, ...node.data },
            position: existingNode.position,
            hidden: node.hidden,
          };
        }

        const initialPosition = getNodeInitialPosition(
          node,
          reactFlowViewport,
          nodesGroup.filter(n => !n.hidden).length,
          nodeIndex,
          sidePanelWidth,
          layoutGroup ?? DEFAULT_LAYOUT_GROUP,
          parentNode
        );

        return { ...node, position: initialPosition };
      });
    }) as IAMAnyNode[];

    CanvasStore.send({ type: 'setNodes', nodes: newNodes });
  }, [nodes, rfInstance]);

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

      // TODO: Instead of sending the actual nodes here, we can just send their IDs and let the state machine look them up.
      // This would help us a lot later when wanting to raise events internally within the state machine since we might not have access to the full nodes data.
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
    initialZoom,
  };
}
