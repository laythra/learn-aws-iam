import { produce } from 'immer';

import { deleteConnectionEdges } from './edges-deletion-state-machine-actions';
import { BaseFinishEventMap, GenericContext } from '../types';
import { IAMAnyNode } from '@/types/iam-node-types';

/**
 * Deletes an edge from the context and all its children
 *  and updates edge objectives and node associations.
 *
 * @param context - The current generic context containing nodes, edges, and objectives.
 * @param edgeToDelete - The edge that should be deleted.
 * @returns An object with the updated edges list and any events related to edge objectives.
 */
export function deleteNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeToDelete: IAMAnyNode
): { updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap> } {
  let updatedContext = produce(context, draftContext => {
    draftContext.nodes = draftContext.nodes.filter(node => node.id !== nodeToDelete.id);
  });
  const edgesToDelete = updatedContext.edges
    .filter(edge => edge.source === nodeToDelete.id || edge.target === nodeToDelete.id)
    .map(edge => edge.id);

  ({ updatedContext } = deleteConnectionEdges<TLevelObjectiveID, TFinishEventMap>(
    updatedContext,
    edgesToDelete
  ));

  return { updatedContext };
}
