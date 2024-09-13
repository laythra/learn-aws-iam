import { createStore } from '@xstate/store';
import {
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

type CanvasStoreState = {
  nodes: Node[];
  edges: Edge[];
};

type CanvasStoreEvents = {
  changeNodesState: { changes: NodeChange[] };
  changeEdgesState: { changes: EdgeChange[] };
  setNodes: { nodes: Node[] };
  setEdges: { edges: Edge[] };
};

export const CanvasStore = createStore<CanvasStoreState, CanvasStoreEvents>(
  { nodes: [], edges: [] },
  {
    changeNodesState: (context: CanvasStoreState, event: { changes: NodeChange[] }) => ({
      nodes: applyNodeChanges(event.changes, context.nodes),
    }),
    changeEdgesState: (context: CanvasStoreState, event: { changes: EdgeChange[] }) => ({
      edges: applyEdgeChanges(event.changes, context.edges),
    }),
    setNodes: (_context: CanvasStoreState, event: { nodes: Node[] }) => ({
      nodes: event.nodes,
    }),
    setEdges: (_context: CanvasStoreState, event: { edges: Edge[] }) => ({
      edges: event.edges,
    }),
  }
);
