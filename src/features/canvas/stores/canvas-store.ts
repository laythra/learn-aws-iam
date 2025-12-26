import { createStoreWithProducer } from '@xstate/store';
import {
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Viewport,
} from '@xyflow/react';
import { produce } from 'immer';

import { positionNewNodes } from '../utils/apply-node-positions';
import { IAMAnyNode, IAMEdge, IAMNodeEntity, NodeLayoutGroup } from '@/types/iam-node-types';

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
  nodesWithDeletionInProgress: Set<string>;
};

type NodesPositioningParams = {
  layoutGroups: NodeLayoutGroup[];
  sidePanelWidth: number;
  reactFlowViewport: Viewport;
};

type CanvasStoreEvents = {
  changeNodesState: { changes: NodeChange<IAMAnyNode>[] };
  changeEdgesState: { changes: EdgeChange<IAMEdge>[] };
  selectEdge: { edgeId?: string };
  hoverOverEdge: { edgeId?: string };
  setNodes: { nodes: IAMAnyNode[] } & NodesPositioningParams;
  setEdges: { edges: IAMEdge[] };
  updateNodePosition: { nodeId: string; position: { x: number; y: number } };
  updateSelectedNodeId: { nodeId: string };
  openNodePanel: { nodeId: string; panel: 'content' | 'tags' | 'arn' | 'users-list' | undefined };
  closeAllNodePanels: unknown;
  clearCanvas: unknown;
  toggleAccountCollapse: { accountId: string };
  markEdgesForDeletion: { edgeIds: string[] };
  markNodesForDeletion: { nodeIds: string[] };
  finalizeEdgesDeletion: { edgeIds: string[] };
  finalizeNodeDeletion: { nodeId: string };
  addEdges: { edges: IAMEdge[] };
  addNodes: { nodes: IAMAnyNode[] } & NodesPositioningParams;
  nodeDataUpdated: { node: IAMAnyNode };
  adjustForSidePanelWidthChange: {
    sidePanelWidth: number;
    viewport: Viewport;
    nodeWidth: number;
  };
};

/**
 * CanvasStore manages the state of nodes and edges on the IAM canvas.
 * It handles actions such as adding, updating, deleting nodes/edges,
 * positioning nodes, and managing selection and hover states.
 * The source of truth for nodes and edges is remains inside the state machine within each level
 * and this store acts as a synchronized view for the React Flow canvas. Emitting events too frequently to the
 * fully fledged state machine can lead to performance issues, such as when the user is dragging nodes around
 * or hovering over edges. Therefore, this store is optimized for responsiveness while keeping in sync with the state machine.
 * Uses Immer for convenient immutable state updates.
 * @returns {CanvasStore} The CanvasStore instance for managing canvas state.
 */
export const CanvasStore = createStoreWithProducer<CanvasStoreState, CanvasStoreEvents>(produce, {
  context: {
    nodes: [],
    edges: [],
    nodesWithDeletionInProgress: new Set<string>(),
  },
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
    setNodes: (ctx: CanvasStoreState, event: { nodes: IAMAnyNode[] } & NodesPositioningParams) => {
      // Position and set nodes
      ctx.nodes = positionNewNodes(
        [],
        event.nodes,
        event.layoutGroups,
        event.sidePanelWidth,
        event.reactFlowViewport
      );
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
    toggleAccountCollapse(ctx: CanvasStoreState, event: { accountId: string }) {
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
      ctx.edges.forEach(edge => {
        if (event.edgeIds.includes(edge.id) && edge.data) {
          edge.data.deletion_in_progress = true;
          edge.animated = false;
          edge.interactionWidth = 0;
          edge.selected = false;
          edge.data.hovering_label = undefined;
        }
      });
    },
    markNodesForDeletion(ctx: CanvasStoreState, event: { nodeIds: string[] }) {
      event.nodeIds.forEach(id => ctx.nodesWithDeletionInProgress.add(id));
    },
    finalizeEdgesDeletion(ctx: CanvasStoreState, event: { edgeIds: string[] }) {
      ctx.edges = ctx.edges.filter(edge => !event.edgeIds.includes(edge.id));
    },
    finalizeNodeDeletion(ctx: CanvasStoreState, event: { nodeId: string }) {
      ctx.nodes = ctx.nodes.filter(node => node.id !== event.nodeId);
      ctx.nodesWithDeletionInProgress.delete(event.nodeId);
    },
    addEdges(ctx: CanvasStoreState, event: { edges: IAMEdge[] }) {
      ctx.edges.push(...event.edges);
    },
    addNodes(ctx: CanvasStoreState, event: { nodes: IAMAnyNode[] } & NodesPositioningParams) {
      const positionedNodes = positionNewNodes(
        ctx.nodes,
        event.nodes,
        event.layoutGroups,
        event.sidePanelWidth,
        event.reactFlowViewport
      );

      ctx.nodes.push(...positionedNodes);
    },
    nodeDataUpdated(ctx: CanvasStoreState, event: { node: IAMAnyNode }) {
      ctx.nodes.find(n => n.id === event.node.id)!.data = event.node.data;
    },
    adjustForSidePanelWidthChange(
      ctx: CanvasStoreState,
      event: {
        sidePanelWidth: number;
        viewport: Viewport;
        nodeWidth: number;
      }
    ) {
      // Calculate the side panel position in flow coordinates
      const sidePanelPosX =
        (window.innerWidth - event.sidePanelWidth - event.viewport.x) / event.viewport.zoom;

      ctx.nodes = ctx.nodes.map(node => {
        if (node.position.x + event.nodeWidth >= sidePanelPosX) {
          return {
            ...node,
            position: {
              ...node.position,
              x: sidePanelPosX - 10 - event.nodeWidth,
            },
          };
        }
        return node;
      });
    },
  },
});
