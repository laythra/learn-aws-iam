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
  const [
    nodes,
    edges,
    sidePanelOpened,
    edgesManagementDisabled,
    layoutGroups,
    blockedConnections,
    levelNumber,
  ] = LevelsProgressionContext().useSelector(
    state => [
      state.context.nodes,
      state.context.edges,
      state.context.side_panel_open,
      state.context.edges_management_disabled,
      state.context.layout_groups,
      state.context.blocked_connections,
      state.context.level_number,
    ],
    _.isEqual
  );

  const hasAccountNodes = nodes.some(node => node.data.entity === IAMNodeEntity.Account);
  const accountNodesWidth = _.sumBy(nodes, node =>
    node.data.entity === IAMNodeEntity.Account ? node.width! + 20 : 0
  );

  // If there are account nodes, set initial zoom to fit them within the viewport width
  const initialZoom = Math.min(hasAccountNodes ? window.innerWidth / accountNodesWidth : 1, 1);
  const [nodesState, edgesState] = useSelector(
    CanvasStore,
    state => [state.context.nodes, state.context.edges],
    _.isEqual
  );

  const levelActor = LevelsProgressionContext().useActorRef();
  const sidePanelWidth = sidePanelOpened ? window.innerWidth * 0.2 : 0;

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<IAMAnyNode, IAMEdge>>();

  // Ensure canvas is cleared when switching levels, to avoid cross-level node/edge residue
  useEffect(() => {
    CanvasStore.send({ type: 'clearCanvas' });
  }, [levelNumber]);

  useEffect(() => {
    CanvasStore.send({ type: 'setEdges', edges });
  }, [edges]);

  // Used to reposition nodes when the side panel is opened, to ensure no nodes are hidden behind it
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

  // Adds newly added nodes to the canvas with their initial positions
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
