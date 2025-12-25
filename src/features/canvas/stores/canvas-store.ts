import { createStoreWithProducer } from '@xstate/store';
import {
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { produce } from 'immer';

import { IAMAnyNode, IAMEdge, IAMNodeEntity } from '@/types/iam-node-types';

type CanvasStoreState = {
  nodes: IAMAnyNode[];
  edges: IAMEdge[];
  selectedEdgeId?: string;
  selectedNodeId?: string;
  hoveredOverEdgeId?: string;
  nodeIdWithOpenedContent?: string;
  nodeIdWithOpenedTags?: string;
  nodeIdWithOpenedARN?: string;
  nodeIdWithOpenedUsersList?: string;
};

type CanvasStoreEvents = {
  changeNodesState: { changes: NodeChange<IAMAnyNode>[] };
  changeEdgesState: { changes: EdgeChange<IAMEdge>[] };
  selectEdge: { edgeId?: string };
  hoverOverEdge: { edgeId?: string };
  setNodes: { nodes: IAMAnyNode[] };
  setEdges: { edges: IAMEdge[] };
  syncEdgesFromMachine: { edges: IAMEdge[] };
  updateNodePosition: { nodeId: string; position: { x: number; y: number } };
  updateSelectedNodeId: { nodeId: string };
  openNodePanel: { nodeId: string; panel: 'content' | 'tags' | 'arn' | 'users-list' | undefined };
  closeAllNodePanels: unknown; // No payload needed for this event
  clearCanvas: unknown;
  toggleAccountCollapse: {
    accountId: string;
  };
  markEdgesForDeletion: { edgeIds: string[] };
  finalizeEdgesDeletion: { edgeIds: string[] };
  addEdges: { edges: IAMEdge[] };
};

export const CanvasStore = createStoreWithProducer<CanvasStoreState, CanvasStoreEvents>(produce, {
  context: { nodes: [], edges: [] },
  on: {
    changeNodesState: (ctx: CanvasStoreState, event: { changes: NodeChange<IAMAnyNode>[] }) => {
      ctx.nodes = applyNodeChanges(event.changes, ctx.nodes);
    },
    changeEdgesState: (ctx: CanvasStoreState, event: { changes: EdgeChange<IAMEdge>[] }) => {
      ctx.edges = applyEdgeChanges(event.changes, ctx.edges);
    },
    hoverOverEdge: (ctx: CanvasStoreState, event: { edgeId?: string }) => {
      ctx.hoveredOverEdgeId = event.edgeId;
    },
    selectEdge: (ctx: CanvasStoreState, event: { edgeId?: string }) => {
      ctx.selectedEdgeId = event.edgeId;
    },
    setNodes: (ctx: CanvasStoreState, event: { nodes: IAMAnyNode[] }) => {
      ctx.nodes = event.nodes;
    },
    setEdges: (ctx: CanvasStoreState, event: { edges: IAMEdge[] }) => {
      ctx.edges = event.edges;
    },
    updateNodePosition(
      ctx: CanvasStoreState,
      event: { nodeId: string; position: { x: number; y: number } }
    ) {
      ctx.nodes.find(nd => nd.id === event.nodeId)!.position = event.position;
    },
    updateSelectedNodeId(ctx: CanvasStoreState, event: { nodeId: string }) {
      ctx.selectedNodeId = event.nodeId;
      ctx.nodes.forEach(node => (node.zIndex = 0));
      ctx.nodes.find(node => node.id == event.nodeId)!.zIndex = 10000;
    },
    openNodePanel(
      ctx: CanvasStoreState,
      event: { nodeId: string; panel: 'content' | 'tags' | 'arn' | 'users-list' | undefined }
    ) {
      ctx.selectedNodeId = event.nodeId;
      ctx.nodeIdWithOpenedContent = event.panel === 'content' ? event.nodeId : undefined;
      ctx.nodeIdWithOpenedTags = event.panel === 'tags' ? event.nodeId : undefined;
      ctx.nodeIdWithOpenedARN = event.panel === 'arn' ? event.nodeId : undefined;
      ctx.nodeIdWithOpenedUsersList = event.panel === 'users-list' ? event.nodeId : undefined;
    },
    closeAllNodePanels(ctx: CanvasStoreState) {
      ctx.nodeIdWithOpenedContent = undefined;
      ctx.nodeIdWithOpenedTags = undefined;
      ctx.nodeIdWithOpenedARN = undefined;
      ctx.nodeIdWithOpenedUsersList = undefined;
    },
    clearCanvas(ctx: CanvasStoreState) {
      ctx.nodes = [];
      ctx.edges = [];
    },
    toggleAccountCollapse(
      ctx: CanvasStoreState,
      event: {
        accountId: string;
      }
    ) {
      const accountNode = ctx.nodes.find(
        node => node.id === event.accountId && node.data.entity === IAMNodeEntity.Account
      );

      if (!accountNode) return;

      const isCollapsed = accountNode.data.collapsed;
      accountNode.data.collapsed = !isCollapsed;

      const childNodes = ctx.nodes.filter(node => node.parentId === event.accountId);
      childNodes.forEach(childNode => {
        childNode.hidden = !isCollapsed;
      });
    },
    markEdgesForDeletion(ctx: CanvasStoreState, event: { edgeIds: string[] }) {
      console.log('Marking edges for deletion:', event.edgeIds);
      ctx.edges.forEach(edge => {
        if (event.edgeIds.includes(edge.id) && edge.data) {
          edge.data.deletion_in_progress = true;
        }
      });
    },
    finalizeEdgesDeletion(ctx: CanvasStoreState, event: { edgeIds: string[] }) {
      ctx.edges = ctx.edges.filter(edge => !event.edgeIds.includes(edge.id));
    },
    syncEdgesFromMachine: (ctx, { edges: machineEdges }) => {
      const deletingIds = new Set(
        ctx.edges.filter((e: IAMEdge) => e.data?.deletion_in_progress).map((e: IAMEdge) => e.id)
      );

      const nextEdges = machineEdges.map(edge => {
        const existing = ctx.edges.find((e: IAMEdge) => e.id === edge.id);
        return existing ?? edge;
      });

      for (const edge of ctx.edges) {
        if (deletingIds.has(edge.id) && !nextEdges.some((e: IAMEdge) => e.id === edge.id)) {
          nextEdges.push(edge);
        }
      }

      ctx.edges = nextEdges;
    },
    addEdges(ctx: CanvasStoreState, event: { edges: IAMEdge[] }) {
      ctx.edges.push(...event.edges);
    },
  },
});
