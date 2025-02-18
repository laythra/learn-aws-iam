import { createStoreWithProducer } from '@xstate/store';
import { produce } from 'immer';
import {
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import { IAMAnyNodeData } from '@/types';

type CanvasStoreState = {
  nodes: Node<IAMAnyNodeData>[];
  edges: Edge[];
  selectedEdgeId?: string;
  selectedNodeId?: string;
  hoveredOverEdgeId?: string;
  openedNodeId?: string;
};

type CanvasStoreEvents = {
  changeNodesState: { changes: NodeChange[] };
  changeEdgesState: { changes: EdgeChange[] };
  selectEdge: { edgeId?: string };
  hoverOverEdge: { edgeId?: string };
  setNodes: { nodes: Node<IAMAnyNodeData>[] };
  setEdges: { edges: Edge[] };
  updateNodePosition: { nodeId: string; position: { x: number; y: number } };
  updateSelectedNodeId: { nodeId: string };
  updateOpenedNodeId: { nodeId: string };
};

export const CanvasStore = createStoreWithProducer<CanvasStoreState, CanvasStoreEvents>(produce, {
  context: { nodes: [], edges: [] },
  on: {
    changeNodesState: (context: CanvasStoreState, event: { changes: NodeChange[] }) => {
      context.nodes = applyNodeChanges(event.changes, context.nodes);
    },
    changeEdgesState: (context: CanvasStoreState, event: { changes: EdgeChange[] }) => {
      context.edges = applyEdgeChanges(event.changes, context.edges);
    },
    hoverOverEdge: (context: CanvasStoreState, event: { edgeId?: string }) => {
      context.hoveredOverEdgeId = event.edgeId;
    },
    selectEdge: (context: CanvasStoreState, event: { edgeId?: string }) => {
      context.selectedEdgeId = event.edgeId;
    },
    setNodes: (context: CanvasStoreState, event: { nodes: Node<IAMAnyNodeData>[] }) => {
      context.nodes = event.nodes;
    },
    setEdges: (context: CanvasStoreState, event: { edges: Edge[] }) => {
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
    },
    updateOpenedNodeId(context: CanvasStoreState, event: { nodeId: string }) {
      context.openedNodeId = event.nodeId;
    },
  },
});
