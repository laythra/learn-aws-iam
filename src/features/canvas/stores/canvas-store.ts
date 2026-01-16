import { createStore } from '@xstate/store';
import {
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Viewport,
} from '@xyflow/react';
import { produce } from 'immer';

import { positionNewNodes } from '../utils/apply-node-positions';
import { IAMNodeEntity } from '@/types/iam-enums';
import { NodeLayoutGroup } from '@/types/iam-layout-types';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

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
  nodeIdsWithDeletionInProgress: Set<string>;
  edgeIdsWithDeletionInProgress: Set<string>;
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
  finalizeNodesDeletion: { nodeIds: string[] };
  addEdges: { edges: IAMEdge[] };
  addNodes: { nodes: IAMAnyNode[] } & NodesPositioningParams;
  updateNodeData: { node: IAMAnyNode };
  adjustForSidePanelWidthChange: {
    sidePanelWidth: number;
    viewport: Viewport;
    nodeWidth: number;
  };
  updateEdges: { edges: IAMEdge[] };
};

/**
 * CanvasStore manages the state of nodes and edges on the IAM canvas.
 * It handles actions such as adding, updating, deleting nodes/edges,
 * positioning nodes, and managing selection and hover states.
 * The source of truth for nodes and edges remains inside the state machine within each level
 * and this store acts as a synchronized view for the React Flow canvas. Emitting events too frequently to the
 * fully fledged state machine can lead to performance issues, such as when the user is dragging nodes around
 * or hovering over edges. Therefore, a lightweight xstate store is more suitable for responsiveness while keeping in sync with the state machine.
 * Uses Immer for convenient immutable state updates.
 * @returns {CanvasStore} The CanvasStore instance for managing canvas state.
 */
export const CanvasStore = createStore<CanvasStoreState, CanvasStoreEvents, never>({
  context: {
    nodes: [],
    edges: [],
    nodeIdsWithDeletionInProgress: new Set<string>(),
    edgeIdsWithDeletionInProgress: new Set<string>(),
  },
  on: {
    changeNodesState: produce(
      (ctx: CanvasStoreState, event: { changes: NodeChange<IAMAnyNode>[] }) => {
        ctx.nodes = applyNodeChanges(event.changes, ctx.nodes);
      }
    ),
    changeEdgesState: produce(
      (ctx: CanvasStoreState, event: { changes: EdgeChange<IAMEdge>[] }) => {
        ctx.edges = applyEdgeChanges(event.changes, ctx.edges);
      }
    ),
    hoverOverEdge: produce((ctx: CanvasStoreState, event: { edgeId?: string }) => {
      ctx.hoveredOverEdgeId = event.edgeId;
    }),
    selectEdge: produce((ctx: CanvasStoreState, event: { edgeId?: string }) => {
      ctx.selectedEdgeId = event.edgeId;
    }),
    setNodes: produce(
      (ctx: CanvasStoreState, event: { nodes: IAMAnyNode[] } & NodesPositioningParams) => {
        // Position and set nodes
        ctx.nodes = positionNewNodes(
          [],
          event.nodes,
          event.layoutGroups,
          event.sidePanelWidth,
          event.reactFlowViewport
        );
      }
    ),
    setEdges: produce((ctx: CanvasStoreState, event: { edges: IAMEdge[] }) => {
      ctx.edges = event.edges;
    }),
    updateNodePosition: produce(
      (ctx: CanvasStoreState, event: { nodeId: string; position: { x: number; y: number } }) => {
        ctx.nodes.find(nd => nd.id === event.nodeId)!.position = event.position;
      }
    ),
    updateSelectedNodeId: produce((ctx: CanvasStoreState, event: { nodeId: string }) => {
      ctx.selectedNodeId = event.nodeId;
      ctx.nodes.forEach(node => (node.zIndex = 0));
      ctx.nodes.find(node => node.id == event.nodeId)!.zIndex = 10000;
    }),
    openNodePanel: produce(
      (
        ctx: CanvasStoreState,
        event: { nodeId: string; panel: 'content' | 'tags' | 'arn' | 'users-list' | undefined }
      ) => {
        ctx.selectedNodeId = event.nodeId;
        ctx.nodeIdWithOpenedContent = event.panel === 'content' ? event.nodeId : undefined;
        ctx.nodeIdWithOpenedTags = event.panel === 'tags' ? event.nodeId : undefined;
        ctx.nodeIdWithOpenedARN = event.panel === 'arn' ? event.nodeId : undefined;
        ctx.nodeIdWithOpenedUsersList = event.panel === 'users-list' ? event.nodeId : undefined;
      }
    ),
    closeAllNodePanels: produce((ctx: CanvasStoreState) => {
      ctx.nodeIdWithOpenedContent = undefined;
      ctx.nodeIdWithOpenedTags = undefined;
      ctx.nodeIdWithOpenedARN = undefined;
      ctx.nodeIdWithOpenedUsersList = undefined;
    }),
    clearCanvas: produce((ctx: CanvasStoreState) => {
      ctx.nodes = [];
      ctx.edges = [];
    }),
    toggleAccountCollapse: produce((ctx: CanvasStoreState, event: { accountId: string }) => {
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
    }),
    markEdgesForDeletion: produce((ctx: CanvasStoreState, event: { edgeIds: string[] }) => {
      // Making edges non-interactive to avoid race conditions during deletion
      // I understand there might be other race conditions, but I won't delve into them now
      ctx.edges.forEach(edge => {
        if (event.edgeIds.includes(edge.id) && edge.data) {
          edge.animated = false;
          edge.interactionWidth = 0;
          edge.selected = false;
          edge.selectable = false;
          edge.data.hovering_label = undefined;
        }
      });

      event.edgeIds.forEach(id => {
        ctx.edgeIdsWithDeletionInProgress.add(id);
      });
    }),
    markNodesForDeletion: produce((ctx: CanvasStoreState, event: { nodeIds: string[] }) => {
      // Making edges non-interactive to avoid race conditions during deletion
      ctx.nodes.forEach(node => {
        if (event.nodeIds.includes(node.id)) {
          node.selected = false;
          node.selectable = false;
        }
      });

      event.nodeIds.forEach(id => {
        ctx.nodeIdsWithDeletionInProgress.add(id);
      });
    }),
    finalizeEdgesDeletion: produce((ctx: CanvasStoreState, event: { edgeIds: string[] }) => {
      ctx.edges = ctx.edges.filter(edge => !event.edgeIds.includes(edge.id));
      event.edgeIds.forEach(id => ctx.edgeIdsWithDeletionInProgress.delete(id));
    }),
    finalizeNodesDeletion: produce((ctx: CanvasStoreState, event: { nodeIds: string[] }) => {
      ctx.nodes = ctx.nodes.filter(node => !event.nodeIds.includes(node.id));
      event.nodeIds.forEach(id => ctx.nodeIdsWithDeletionInProgress.delete(id));
    }),
    addEdges: produce((ctx: CanvasStoreState, event: { edges: IAMEdge[] }) => {
      ctx.edges.push(...event.edges);
    }),
    addNodes: produce(
      (ctx: CanvasStoreState, event: { nodes: IAMAnyNode[] } & NodesPositioningParams) => {
        const positionedNodes = positionNewNodes(
          ctx.nodes,
          event.nodes,
          event.layoutGroups,
          event.sidePanelWidth,
          event.reactFlowViewport
        );

        ctx.nodes.push(...positionedNodes);
      }
    ),
    updateNodeData: produce((ctx: CanvasStoreState, event: { node: IAMAnyNode }) => {
      ctx.nodes.find(n => n.id === event.node.id)!.data = event.node.data;
    }),
    adjustForSidePanelWidthChange: produce(
      (
        ctx: CanvasStoreState,
        event: {
          sidePanelWidth: number;
          viewport: Viewport;
          nodeWidth: number;
        }
      ) => {
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
      }
    ),
    updateEdges: produce((ctx: CanvasStoreState, event: { edges: IAMEdge[] }) => {
      ctx.edges = ctx.edges.map(edge => {
        const updatedEdge = event.edges.find(e => e.id === edge.id);
        return updatedEdge ? updatedEdge : edge;
      });
    }),
  },
});
