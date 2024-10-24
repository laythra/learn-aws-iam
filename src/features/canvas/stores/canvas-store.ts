import { click } from '@testing-library/user-event/dist/click';
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

type CanvasStoreState = {
  nodes: Node[];
  edges: Edge[];
  clickedEdgeId?: string;
};

type CanvasStoreEvents = {
  changeNodesState: { changes: NodeChange[] };
  changeEdgesState: { changes: EdgeChange[] };
  hoverOverEdge: { edge: Edge; isHovering: boolean };
  clickEdge: { edgeId: string };
  deselectEdges: { type: string };
  setNodes: { nodes: Node[] };
  setEdges: { edges: Edge[] };
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
    hoverOverEdge: (context: CanvasStoreState, event: { edge: Edge; isHovering: boolean }) => {
      const targetEdge = context.edges.find(e => e.id === event.edge.id);
      if (!targetEdge) return;

      targetEdge.data.is_hovering = event.isHovering;
    },
    clickEdge: (context: CanvasStoreState, event: { edgeId: string }) => {
      context.clickedEdgeId = event.edgeId;
    },
    deselectEdges: (context: CanvasStoreState) => {
      context.clickedEdgeId = undefined;
    },
    setNodes: (context: CanvasStoreState, event: { nodes: Node[] }) => {
      context.nodes = event.nodes;
    },
    setEdges: (context: CanvasStoreState, event: { edges: Edge[] }) => {
      context.edges = event.edges;
    },
  },
});
