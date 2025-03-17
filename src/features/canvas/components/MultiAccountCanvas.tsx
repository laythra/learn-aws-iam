import React, { useRef } from 'react';

import { Box, Text, Divider, useTheme, IconButton } from '@chakra-ui/react';
import ReactFlow, { ConnectionMode, Node } from 'reactflow';

import ARNIconButton from './ARNIconButton';
import IAMCanvasEdge from './IAMCanvasEdge';
import IAMCanvasNode from './IAMCanvasNode';
import { useCanvas } from '../hooks/useCanvas';
import { CanvasStore } from '../stores/canvas-store';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import { AccountID } from '@/machines/types';
import { CustomTheme, IAMAnyNodeData } from '@/types';

import 'reactflow/dist/style.css';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const edgeTypes = {
  iam_default: IAMCanvasEdge,
};

const MultiAccountCanvas: React.FC = () => {
  const {
    rfInstance,
    nodesState,
    edgesState,
    onConnect,
    onEdgeDelete,
    setRfInstance,
    sidePanelWidth,
  } = useCanvas({});
  const theme = useTheme<CustomTheme>();
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const onNodeDragStop = (_event: React.MouseEvent, node: Node<IAMAnyNodeData>): void => {
    if (!rfInstance || !canvasWrapperRef.current) return;

    const { width } = canvasWrapperRef.current.getBoundingClientRect();
    const midpointScreen = width / 2;

    const midpointInFlowCoords = rfInstance.screenToFlowPosition({
      x: midpointScreen,
      y: 0,
    });

    if (
      node.position.x + theme.sizes.iamNodeWidthInPixels >= midpointInFlowCoords.x &&
      node.data.account_id === AccountID.Destination
    ) {
      const clampedX = midpointInFlowCoords.x - theme.sizes.iamNodeWidthInPixels - 10;
      CanvasStore.send({
        type: 'updateNodePosition',
        nodeId: node.id,
        position: { x: clampedX, y: node.position.y },
      });
    }

    if (
      node.position.x <= midpointInFlowCoords.x &&
      node.data.account_id === AccountID.Originating
    ) {
      const clampedX = midpointInFlowCoords.x + 10;
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
        autoPanOnConnect={false}
        zoomOnPinch={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        panOnDrag={false}
        panOnScroll={false}
        connectionMode={ConnectionMode.Loose}
        nodeExtent={[
          [0, 0],
          [window.innerWidth - sidePanelWidth, window.innerHeight],
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
      />

      <Text
        position='absolute'
        top={4}
        left={4}
        p={2}
        bg='gray.100'
        borderRadius='md'
        fontWeight={700}
      >
        Destination Account
        <ARNIconButton
          arn='arn:aws:iam::123456789012:user/secure.corp'
          onCopyEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
          onOpenEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
          placement='bottom-end'
          ml={2}
        />
      </Text>

      <Text
        position='absolute'
        top={4}
        right={4}
        p={2}
        bg='gray.100'
        borderRadius='md'
        fontWeight={700}
      >
        Originating Account
        <ARNIconButton
          arn='arn:aws:iam::123456789012:user/secure.corp'
          onCopyEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
          onOpenEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
          placement='bottom-end'
          ml={2}
        />
      </Text>
    </Box>
  );
};

export default MultiAccountCanvas;
