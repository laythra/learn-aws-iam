import React from 'react';

import ReactFlow, { Background, BackgroundVariant, ConnectionMode } from 'reactflow';

import IAMCanvasEdge from './IAMCanvasEdge';
import IAMCanvasNode from './IAMCanvasNode';
import { useCanvas } from '../hooks/useCanvas';
import { CanvasStore } from '../stores/canvas-store';
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
    <ReactFlow
      onNodesChange={changes => CanvasStore.send({ type: 'changeNodesState', changes })}
      onEdgesChange={changes => CanvasStore.send({ type: 'changeEdgesState', changes })}
      onInit={rfi => setRfInstance(rfi)}
      nodes={nodesState}
      edges={edgesState}
      connectionMode={ConnectionMode.Loose}
      onConnect={onConnect}
      onEdgesDelete={onEdgeDelete}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onEdgeMouseEnter={(_e, edge) => CanvasStore.send({ type: 'hoverOverEdge', edgeId: edge.id })}
      onEdgeMouseLeave={() => CanvasStore.send({ type: 'hoverOverEdge', edgeId: undefined })}
    >
      <Background color='#ccc' variant={BackgroundVariant.Dots} size={2} gap={14} />
    </ReactFlow>
  );
};

export default Canvas;
