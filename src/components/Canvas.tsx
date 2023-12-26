import React, { useCallback } from 'react';

import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Box } from '@chakra-ui/react';
import DotsPattern from 'assets/images/dots_pattern.svg';
import IAMNode from 'components/nodes/IAMNode';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import styled from 'styled-components';
import { AntdIconType } from 'types';

const CavnasWrapper = styled(Box)`
  width: 100vw;
  height: 100vh;
  background-color: #000;
  background-image: url(${DotsPattern});
  background-repeat: repeat;
  background-color: transparent;
`;

type IconName = 'UserOutlined' | 'HomeOutlined';

const nodeTypes = {
  userNode: IAMNode,
  circularNode: IAMNode,
};

const iconMap: Record<IconName, AntdIconType> = {
  UserOutlined: UserOutlined,
  HomeOutlined: HomeOutlined,
};

const Canvas: React.FC = () => {
  const initialNodes = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: 'Test Node1', icon: UserOutlined },
      type: 'userNode',
    },
    {
      id: '2',
      position: { x: 0, y: 100 },
      data: { label: 'Test Node2', icon: UserOutlined },
      type: 'circularNode',
      draggable: false,
    },
  ];

  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const label = event.dataTransfer.getData('text/plain');
    const iconName = event.dataTransfer.getData(
      'application/icon-name'
    ) as IconName;
    const canvasRect = (event.target as Element).getBoundingClientRect();

    // TODO: Handle when canvas is zoomed in/out, or simply render node in the center?
    const canvasX = event.clientX - canvasRect.left;
    const canvasY = event.clientY - canvasRect.top;

    const newNode = {
      id: Date.now().toString(),
      type: 'userNode',
      position: { x: canvasX, y: canvasY },
      data: {
        label: label,
        icon: iconMap[iconName],
      },
    };

    setNodes(nodes => [...nodes, newNode]);
  };

  const onConnect = useCallback(
    (params: any) => setEdges(es => addEdge(params, es)),
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
    </CavnasWrapper>
  );
};

export default Canvas;
