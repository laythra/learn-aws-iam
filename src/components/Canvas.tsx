import React, { useCallback } from 'react';

import { Box } from '@chakra-ui/react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Edge, Connection } from 'reactflow';
import styled from 'styled-components';

import Logo from './Logo';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import IAMCanvasNode from '@/components/nodes/IAMCanvasNode';
import { IAMNodeEntity } from '@/types';

const CavnasWrapper = styled(Box)`
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
  const initialNodes = [
    {
      id: '100',
      position: { x: 0, y: 0 },
      data: { id: '100', label: 'Test Node1', entity: IAMNodeEntity.User },
      type: 'iam_default',
    },
    {
      id: '200',
      position: { x: 0, y: 100 },
      data: { id: '200', label: 'Test Node2', entity: IAMNodeEntity.User },
      type: 'iam_default',
    },
  ];

  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
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
    <CavnasWrapper onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
      <Logo />
    </CavnasWrapper>
  );
};

export default Canvas;
