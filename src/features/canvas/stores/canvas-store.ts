import { createStoreWithProducer } from '@xstate/store';
import {
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { produce } from 'immer';

import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

type CanvasStoreState = {
  nodes: IAMAnyNode[];
  edges: IAMEdge[];
  selectedEdgeId?: string;
  selectedNodeId?: string;
  hoveredOverEdgeId?: string;
  openedNodeId?: string;
};

type CanvasStoreEvents = {
  changeNodesState: { changes: NodeChange<IAMAnyNode>[] };
  changeEdgesState: { changes: EdgeChange<IAMEdge>[] };
  selectEdge: { edgeId?: string };
  hoverOverEdge: { edgeId?: string };
  setNodes: { nodes: IAMAnyNode[] };
  setEdges: { edges: IAMEdge[] };
  updateNodePosition: { nodeId: string; position: { x: number; y: number } };
  updateSelectedNodeId: { nodeId: string };
  updateOpenedNodeId: { nodeId: string };
};

export const CanvasStore = createStoreWithProducer<CanvasStoreState, CanvasStoreEvents>(produce, {
  context: { nodes: [], edges: [] },
  on: {
    changeNodesState: (context: CanvasStoreState, event: { changes: NodeChange<IAMAnyNode>[] }) => {
      context.nodes = applyNodeChanges(event.changes, context.nodes);
    },
    changeEdgesState: (context: CanvasStoreState, event: { changes: EdgeChange<IAMEdge>[] }) => {
      context.edges = applyEdgeChanges(event.changes, context.edges);
    },
    hoverOverEdge: (context: CanvasStoreState, event: { edgeId?: string }) => {
      context.hoveredOverEdgeId = event.edgeId;
    },
    selectEdge: (context: CanvasStoreState, event: { edgeId?: string }) => {
      context.selectedEdgeId = event.edgeId;
    },
    setNodes: (context: CanvasStoreState, event: { nodes: IAMAnyNode[] }) => {
      context.nodes = event.nodes;
    },
    setEdges: (context: CanvasStoreState, event: { edges: IAMEdge[] }) => {
      context.edges = event.edges;
    },
    updateNodePosition(
      context: CanvasStoreState,
      event: { nodeId: string; position: { x: number; y: number } }
    ) {
      context.nodes.find(nd => nd.id === event.nodeId)!.position = event.position;
    },
    updateSelectedNodeId(context: CanvasStoreState, event: { nodeId: string }) {
      context.selectedNodeId = event.nodeId;
      context.nodes.forEach(node => (node.zIndex = 0));
      context.nodes.find(node => node.id == event.nodeId)!.zIndex = 10000;
    },
    updateOpenedNodeId(context: CanvasStoreState, event: { nodeId: string }) {
      context.openedNodeId = event.nodeId;
    },
  },
});
