import React, { useCallback, useEffect, useState, useRef } from 'react';

import { Box, Text, Divider, useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import ReactFlow, { Node, ReactFlowInstance, type Connection, type Edge } from 'reactflow';
import { EventFromLogic } from 'xstate';

import IAMCanvasEdge from './IAMCanvasEdge';
import IAMCanvasNode from './IAMCanvasNode';
import { CanvasStore } from '../stores/canvas-store';
import { edgeConnectionHandlers } from '../utils/edges-creation';
import { getNodeWithInitialPosition } from '../utils/nodes-position';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import {
  currentLevelStateMachine,
  LevelsProgressionContext,
} from '@/components/providers/LevelsProgressionProvider';
import useSidePanels from '@/hooks/useSidePanels';
import { CustomTheme, IAMAnyNodeData, type IAMEdgeData } from '@/types';
import storage from '@/utils/storage';

import 'reactflow/dist/style.css';
import { AccountID } from '@/machines/types';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const edgeTypes = {
  iam_default: IAMCanvasEdge,
};

const MultiAccountCanvas: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const [nodes, edges, levelFinished] = LevelsProgressionContext.useSelector(
    state => [state.context.nodes, state.context.edges, state.context.level_finished],
    _.isEqual
  );

  const levelActor = LevelsProgressionContext.useActorRef();
  const { ref: sidePanelRef } = useSidePanels();
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const [nodesState, edgesState] = useSelector(
    CanvasStore,
    state => [state.context.nodes, state.context.edges],
    _.isEqual
  );

  useEffect(() => {
    CanvasStore.send({ type: 'setEdges', edges });
  }, [edges]);

  useEffect(() => {
    if (!rfInstance) return;

    const reactFlowViewport = rfInstance.getViewport();
    const nodeGroups = _.groupBy(nodes, 'data.initial_position');

    const newNodes = Object.values(nodeGroups).flatMap(nodesGroup => {
      return nodesGroup.map((node, nodeIndex) => {
        const existingNode = _.find(nodesState, { id: node.id });

        if (existingNode) {
          return {
            ...existingNode,
            data: { ...existingNode.data, ...node.data },
            position: existingNode.position, // Ensure position remains unchanged
          };
        }

        return getNodeWithInitialPosition(
          node,
          reactFlowViewport,
          nodesGroup.length,
          nodeIndex,
          sidePanelRef?.current?.clientWidth || 0
        );
      });
    });

    CanvasStore.send({ type: 'setNodes', nodes: newNodes });
  }, [nodes, rfInstance]);

  useEffect(() => {
    if (rfInstance && levelFinished) {
      const flowState = rfInstance.toObject();
      storage.setKey('flow_state', JSON.stringify(flowState));
    }
  }, [levelFinished]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target || !params.source || !params.target) {
        return;
      }

      const sourceNode = _.find<Node<IAMAnyNodeData>>(nodes, { id: params.source });
      const targetNode = _.find<Node<IAMAnyNodeData>>(nodes, { id: params.target });

      const connectionHandlerKey = `${sourceNode?.data.entity}-${targetNode?.data.entity}`;
      const connectionEventName = edgeConnectionHandlers[connectionHandlerKey];

      if (!connectionEventName) {
        return;
      }

      levelActor.send({ type: connectionEventName, sourceNode, targetNode } as EventFromLogic<
        typeof currentLevelStateMachine
      >);
    },
    [nodes]
  );

  const onEdgeDelete = useCallback((targetEdges: Edge<IAMEdgeData>[]) => {
    levelActor.send({ type: 'DELETE_EDGE', edge: targetEdges[0] });
  }, []);

  const onNodeDragStop = (_event: React.MouseEvent, node: Node<IAMAnyNodeData>): void => {
    if (!rfInstance || !canvasWrapperRef.current) return;

    const { width } = canvasWrapperRef.current.getBoundingClientRect();
    const midpointScreen = width / 2;

    const midpointInFlowCoords = rfInstance.screenToFlowPosition({
      x: midpointScreen,
      y: 0,
    });

    if (
      node.position.x <= midpointInFlowCoords.x &&
      node.data.account_id === AccountID.Destination
    ) {
      const clampedX = midpointInFlowCoords.x + 10;
      CanvasStore.send({
        type: 'updateNodePosition',
        nodeId: node.id,
        position: { x: clampedX, y: node.position.y },
      });
    }

    if (
      node.position.x >= midpointInFlowCoords.x &&
      node.data.account_id === AccountID.Originating
    ) {
      const clampedX = midpointInFlowCoords.x - theme.sizes.iamNodeWidthInPixels - 10;
      CanvasStore.send({
        type: 'updateNodePosition',
        nodeId: node.id,
        position: { x: clampedX, y: node.position.y },
      });
    }
  };

  return (
    <Box
      backgroundColor='white'
      backgroundImage={DotsPattern}
      backgroundRepeat='repeat'
      position='relative'
      height='1200'
      maxH={window.innerHeight}
      maxW={window.innerWidth}
      ref={canvasWrapperRef}
    >
      <ReactFlow
        onNodesChange={changes => CanvasStore.send({ type: 'changeNodesState', changes })}
        onEdgesChange={changes => CanvasStore.send({ type: 'changeEdgesState', changes })}
        nodes={nodesState}
        onInit={rfi => setRfInstance(rfi)}
        edges={edgesState}
        onConnect={onConnect}
        onEdgesDelete={onEdgeDelete}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        autoPanOnNodeDrag={false}
        zoomOnPinch={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        panOnDrag={false}
        panOnScroll={false}
        nodeExtent={[
          [0, 0],
          [window.innerWidth, window.innerHeight],
        ]}
        onEdgeMouseEnter={(_e, edge) =>
          CanvasStore.send({ type: 'hoverOverEdge', edgeId: edge.id })
        }
        onEdgeMouseLeave={() => CanvasStore.send({ type: 'hoverOverEdge', edgeId: undefined })}
      />

      <Divider
        orientation='vertical'
        borderColor='gray.400'
        borderWidth='1px'
        position='absolute'
        left='50%'
        top='0'
        bottom='0'
        borderStyle='dashed'
        sx={{
          animation: 'dash-animation 2s linear infinite',
        }}
      />

      <Text
        position='absolute'
        top={theme.sizes.navbarHeightInPixels + 10}
        left={8}
        p={2}
        bg='gray.100'
        borderRadius='md'
        fontWeight={700}
      >
        Destination Account
      </Text>

      <Text
        position='absolute'
        top={theme.sizes.navbarHeightInPixels + 10}
        right={8}
        p={2}
        bg='gray.100'
        borderRadius='md'
        fontWeight={700}
      >
        Originating Account
      </Text>
    </Box>
  );
};

export default MultiAccountCanvas;
