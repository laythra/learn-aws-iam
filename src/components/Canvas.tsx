import React, { useCallback } from 'react';

import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Box } from '@chakra-ui/react';
import DotsPattern from 'assets/images/dots_pattern.svg';
import IAMCanvasNode from 'components/nodes/IAMCanvasNode';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Edge, Connection } from 'reactflow';
import styled from 'styled-components';
import { AntdIconType } from 'types';

import Logo from './Logo';

const CavnasWrapper = styled(Box)`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  background-image: url(${DotsPattern});
  background-repeat: repeat;
  background-color: transparent;
`;

type IconName = 'UserOutlined' | 'HomeOutlined';

const nodeTypes = {
  userNode: IAMCanvasNode,
  circularNode: IAMCanvasNode,
};

const iconMap: Record<IconName, AntdIconType> = {
  UserOutlined: UserOutlined,
  HomeOutlined: HomeOutlined,
};

const Canvas: React.FC = () => {
  const initialNodes = [
    {
      id: '100',
      position: { x: 0, y: 0 },
      data: { label: 'Test Node1', icon: UserOutlined, id: '100' },
      type: 'userNode',
    },
    {
      id: '200',
      position: { x: 0, y: 100 },
      data: { label: 'Test Node2', icon: UserOutlined, id: '200' },
      type: 'circularNode',
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

    const { id, type, description, label, iconName } = JSON.parse(
      event.dataTransfer.getData('json-node-data')
    );
    const canvasRect = (event.target as Element).getBoundingClientRect();

    // TODO: Handle when canvas is zoomed in/out, or simply render node in the center?
    const canvasX = event.clientX - canvasRect.left;
    const canvasY = event.clientY - canvasRect.top;

    const newNode = {
      id: id,
      type: 'userNode',
      position: { x: canvasX, y: canvasY },
      data: {
        label: label,
        icon: iconMap[iconName as IconName],
        id: id,
        type: type,
        description: description,
      },
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
