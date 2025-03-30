import { produce } from 'immer';
import _ from 'lodash';

import { BaseFinishEventMap, GenericContext } from '../types';
import { getEdgeName } from '@/utils/names';

/**
 * Deletes an edge from the context and all its children
 *  and updates connection objectives and node associations.
 *
 * @param context - The current generic context containing nodes, edges, and objectives.
 * @param edgeToDelete - The edge that should be deleted.
 * @returns An object with the updated edges list and any events related to connection objectives.
 */
export function deleteConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  edgesToDelete: string[]
): { updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap> } {
  const updatedContext = produce(context, draftContext => {
    const nodesConnections = draftContext.nodes_connnections;
    const deletedEdges: string[] = [];

    function deleteEdge(edgeId: string): void {
      console.log("The edge id we're about to delete is: " + edgeId);
      const dependents = nodesConnections
        .filter(connection => connection.parent_edge_id === edgeId)
        .map(connection => getEdgeName(connection.from.id, connection.to.id));

      dependents.forEach(edge => deleteEdge(edge));
      deletedEdges.push(edgeId);
      draftContext.nodes_connnections = nodesConnections.filter(
        connection => getEdgeName(connection.from.id, connection.to.id) !== edgeId
      );
    }

    edgesToDelete.forEach(deleteEdge);
    draftContext.edges = draftContext.edges.filter(edge => !deletedEdges.includes(edge.id));
  });

  return { updatedContext };
}
