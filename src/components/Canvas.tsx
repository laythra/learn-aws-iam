import React, { useCallback } from 'react';

import { Box } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Edge, Connection } from 'reactflow';
import styled from 'styled-components';

import Logo from './Logo';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import IAMCanvasNode from '@/components/nodes/IAMCanvasNode';
import { IAMNodeEntity } from '@/types';

const CanvasBackground = styled(Box)`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  background-image: url(${DotsPattern});
  background-repeat: repeat;
  background-color: transparent;
`;

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const Canvas: React.FC = () => {
  const theme = useTheme();
  const initialNodes = [
    {
      id: '1',
      position: { x: 250, y: 250 },
      data: { label: 'Test Node1', entity: IAMNodeEntity.User },
      style: { zIndex: 10 },
      type: 'iam_default',
    },
    {
      id: '2',
      position: { x: 500, y: 0 },
      data: { label: 'Test Node2', entity: IAMNodeEntity.User },
      style: { zIndex: 10 },
      type: 'iam_default',
    },
    {
      id: '3',
      position: { x: 750, y: 0 },
      data: { label: 'Test Node3', entity: IAMNodeEntity.User },
      style: { zIndex: 10 },
      type: 'iam_default',
    },
  ];

  const initialEdges = [] as Edge[];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent): void => {
    event.preventDefault();

    const nodeData = JSON.parse(event.dataTransfer.getData('json-node-data'));
    const canvasRect = (event.target as Element).getBoundingClientRect();

    // TODO: Handle when canvas is zoomed in/out, or simply render node in the center?
    const canvasX = event.clientX - canvasRect.left;
    const canvasY = event.clientY - canvasRect.top;

    const newNode = {
      id: nodeData['id'],
      type: 'iam-default',
      position: { x: canvasX, y: canvasY },
      data: nodeData,
    };

    setNodes(oldNodes => [...oldNodes, newNode]);
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(es => addEdge(params, es)),
    []
  );

  return (
    <CanvasBackground onDragOver={handleDragOver} onDrop={handleDrop}>
      <Box position='relative' height='100%' width='100%' zIndex={theme.zIndices.popover}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        />
      </Box>
      <Logo />
    </CanvasBackground>
  );
};

export default Canvas;
