import { useEffect } from 'react';

import { ReactFlowInstance } from '@xyflow/react';
import { Actor } from 'xstate';

import { CanvasStore } from '../stores/canvas-store';
import { AnyLevelMachine } from '@/components/providers/level-actor-contexts';
import { NodeLayoutGroup } from '@/types/iam-layout-types';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

export type LevelActorRef = Actor<AnyLevelMachine>;

interface UseCanvasStoreSyncOptions {
  rfInstance: ReactFlowInstance<IAMAnyNode, IAMEdge> | undefined;
  levelActor: LevelActorRef;
  layoutGroups: NodeLayoutGroup[];
  sidePanelWidth: number;
  adjustCanvasZoom: (nodes: IAMAnyNode[]) => void;
}

export function useCanvasStoreSync({
  rfInstance,
  levelActor,
  layoutGroups,
  sidePanelWidth,
  adjustCanvasZoom,
}: UseCanvasStoreSyncOptions): void {
  // This useEffect initializes the canvas store with nodes and edges from the state machine when the React Flow instance becomes available.
  // We need this initialization because event-driven updates alone aren't sufficient, as events may fire before this hook is set up, causing us to miss them.
  useEffect(() => {
    if (!rfInstance) return;

    const snapshot = levelActor.getSnapshot();

    adjustCanvasZoom(snapshot.context.nodes);

    CanvasStore.send({
      type: 'setNodes',
      nodes: snapshot.context.nodes,
      layoutGroups,
      sidePanelWidth,
      reactFlowViewport: rfInstance.getViewport(),
    });

    CanvasStore.send({
      type: 'setEdges',
      edges: snapshot.context.edges,
    });
  }, [levelActor, rfInstance]);

  // This useEffect sets up subscriptions to the level actor to listen for node and edge changes.
  // It acts as the synchronization layer between the state machine and the canvas store.
  // Each event is handled separately to make integrating animations easier in the future.
  // For example, when edges are deleted, we might wanna trigger a fade-out animation before actually removing them from the state.
  // Therefore, we separate the "mark for deletion" and "finalize deletion" steps.
  useEffect(() => {
    if (!rfInstance) return;

    const edgesDeletedSub = levelActor.on('EDGES_DELETED', ({ edgeIds }: { edgeIds: string[] }) => {
      // The deletion process for edges is split into two steps:
      // 1. Mark edges for deletion (this is where we can trigger animations)
      // 2. Finalize edges deletion (actually remove them from the state, happens after animation completes)
      CanvasStore.send({ type: 'markEdgesForDeletion', edgeIds });
    });

    const nodesDeletedSub = levelActor.on('NODES_DELETED', ({ nodeIds }: { nodeIds: string[] }) => {
      CanvasStore.send({ type: 'markNodesForDeletion', nodeIds });
    });

    const edgesAddedSub = levelActor.on(
      'EDGES_ADDED',
      ({ edges: newEdges }: { edges: IAMEdge[] }) => {
        CanvasStore.send({ type: 'addEdges', edges: newEdges });
      }
    );

    const nodesAddedSub = levelActor.on(
      'NODES_ADDED',
      ({ nodes: newNodes }: { nodes: IAMAnyNode[] }) => {
        CanvasStore.send({
          type: 'addNodes',
          nodes: newNodes,
          layoutGroups,
          sidePanelWidth,
          reactFlowViewport: rfInstance.getViewport(),
        });
      }
    );

    const edgesResetSub = levelActor.on(
      'EDGES_RESET',
      ({ edges: newEdges }: { edges: IAMEdge[] }) => {
        CanvasStore.send({ type: 'setEdges', edges: newEdges });
      }
    );

    const nodesResetSub = levelActor.on(
      'NODES_RESET',
      ({ nodes: newNodes }: { nodes: IAMAnyNode[] }) => {
        adjustCanvasZoom(newNodes);

        CanvasStore.send({
          type: 'setNodes',
          nodes: newNodes,
          layoutGroups,
          sidePanelWidth,
          reactFlowViewport: rfInstance.getViewport(),
        });
      }
    );

    const nodeUpdatedSub = levelActor.on('NODE_UPDATED', ({ node }: { node: IAMAnyNode }) => {
      CanvasStore.send({ type: 'updateNodeData', node });
    });

    const edgesUpdatedSub = levelActor.on('EDGES_UPDATED', ({ edges }: { edges: IAMEdge[] }) => {
      CanvasStore.send({ type: 'updateEdges', edges });
    });

    return () => {
      edgesDeletedSub.unsubscribe();
      edgesAddedSub.unsubscribe();
      edgesResetSub.unsubscribe();
      nodesDeletedSub.unsubscribe();
      nodesAddedSub.unsubscribe();
      nodesResetSub.unsubscribe();
      nodeUpdatedSub.unsubscribe();
      edgesUpdatedSub.unsubscribe();
    };
  }, [levelActor, rfInstance, sidePanelWidth]);
}
