import { produce } from 'immer';
import _ from 'lodash';
import { Edge, Node } from 'reactflow';

import { BaseFinishEventMap, GenericContext } from '../types';
import { createEdge } from '@/factories/edge-factory';
import { IAMAnyNodeData, IAMEdgeData } from '@/types';
import { getEdgeName } from '@/utils/names';

/**
 * Deletes an edge from the context and all its children
 *  and updates connection objectives and node associations.
 *
 * @param context - The current generic context containing nodes, edges, and objectives.
 * @param edgeToDelete - The edge that should be deleted.
 * @returns An object with the updated edges list and any events related to connection objectives.
 */
export function deleteNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeToDelete: Node<IAMAnyNodeData>
): { updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap> } {
  const updatedContext = produce(context, draftContext => {
    draftContext.nodes = draftContext.nodes.filter(node => node.id !== nodeToDelete.id);
  });

  return { updatedContext };
}
