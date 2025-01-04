import React from 'react';

import { Box } from '@chakra-ui/react';
import ReactFlow from 'reactflow';

import IAMCanvasEdge from './IAMCanvasEdge';
import IAMCanvasNode from './IAMCanvasNode';
import { useCanvas } from '../hooks/useCanvas';
import { CanvasStore } from '../stores/canvas-store';
import DotsPattern from '@/assets/images/dots_pattern.svg';

import 'reactflow/dist/style.css';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const edgeTypes = {
  iam_default: IAMCanvasEdge,
};

const Canvas: React.FC = () => {
  const { nodesState, edgesState, onConnect, onEdgeDelete, setRfInstance } = useCanvas({});

  return (
    <Box
      backgroundColor='white'
      backgroundImage={DotsPattern}
      backgroundRepeat='repeat'
      position='relative'
      height='100vh'
    >
      <ReactFlow
        onNodesChange={changes => CanvasStore.send({ type: 'changeNodesState', changes })}
        onEdgesChange={changes => CanvasStore.send({ type: 'changeEdgesState', changes })}
        onInit={rfi => setRfInstance(rfi)}
        nodes={nodesState}
        edges={edgesState}
        onConnect={onConnect}
        onEdgesDelete={onEdgeDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgeMouseEnter={(_e, edge) =>
          CanvasStore.send({ type: 'hoverOverEdge', edgeId: edge.id })
        }
        onEdgeMouseLeave={() => CanvasStore.send({ type: 'hoverOverEdge', edgeId: undefined })}
      />
    </Box>
  );
};

export default Canvas;
