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
  updateNodePosition: { nodeId: string; position: { x: number; y: number } };
  updateSelectedNodeId: { nodeId: string };
  openNodePanel: { nodeId: string; panel: 'content' | 'tags' | 'arn' | 'users-list' | undefined };
  closeAllNodePanels: unknown; // No payload needed for this event
  clearCanvas: unknown;
  toggleAccountCollapse: {
    accountId: string;
  };
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
    openNodePanel(
      context: CanvasStoreState,
      event: { nodeId: string; panel: 'content' | 'tags' | 'arn' | 'users-list' | undefined }
    ) {
      context.selectedNodeId = event.nodeId;
      context.nodeIdWithOpenedContent = event.panel === 'content' ? event.nodeId : undefined;
      context.nodeIdWithOpenedTags = event.panel === 'tags' ? event.nodeId : undefined;
      context.nodeIdWithOpenedARN = event.panel === 'arn' ? event.nodeId : undefined;
      context.nodeIdWithOpenedUsersList = event.panel === 'users-list' ? event.nodeId : undefined;
    },
    closeAllNodePanels(context: CanvasStoreState) {
      context.nodeIdWithOpenedContent = undefined;
      context.nodeIdWithOpenedTags = undefined;
      context.nodeIdWithOpenedARN = undefined;
      context.nodeIdWithOpenedUsersList = undefined;
    },
    clearCanvas(context: CanvasStoreState) {
      context.nodes = [];
      context.edges = [];
    },
    toggleAccountCollapse(
      context: CanvasStoreState,
      event: {
        accountId: string;
      }
    ) {
      const accountNode = context.nodes.find(
        node => node.id === event.accountId && node.data.entity === IAMNodeEntity.Account
      );

      if (!accountNode) return;

      const isCollapsed = accountNode.data.collapsed;
      accountNode.data.collapsed = !isCollapsed;

      const childNodes = context.nodes.filter(node => node.parentId === event.accountId);
      childNodes.forEach(childNode => {
        childNode.hidden = !isCollapsed;
      });
    },
  },
});
