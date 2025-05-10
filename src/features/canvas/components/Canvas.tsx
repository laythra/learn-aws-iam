import React from 'react';

import { ReactFlow, Background, BackgroundVariant, ConnectionMode } from '@xyflow/react';

import { AccountCanvasNode } from './AccountCanvasNode';
import IAMCanvasEdge from './IAMCanvasEdge';
import IAMCanvasNode from './IAMCanvasNode';
import { useCanvas } from '../hooks/useCanvas';
import { CanvasStore } from '../stores/canvas-store';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  policy: IAMCanvasNode,
  user: IAMCanvasNode,
  iam_group: IAMCanvasNode,
  role: IAMCanvasNode,
  resource: IAMCanvasNode,
  account: AccountCanvasNode,
  ou: IAMCanvasNode,
  scp: IAMCanvasNode,
};

const edgeTypes = {
  default: IAMCanvasEdge,
};

const Canvas: React.FC = () => {
  const { nodesState, edgesState, onConnect, onEdgeDelete, onNodeDelete, setRfInstance } =
    useCanvas({});

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
      onNodesDelete={onNodeDelete}
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
