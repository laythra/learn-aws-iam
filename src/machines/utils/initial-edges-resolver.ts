import _ from 'lodash';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { BaseFinishEventMap, GenericContext, NodeConnection } from '../types';
import { IAMEdge } from '@/types';

export function resolveInitialEdges<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>
): { edges: IAMEdge[]; nodes_connections: NodeConnection[] } {
  if (!context.initial_node_connections) {
    return { edges: [], nodes_connections: [] };
  }

  const nodeById = _.keyBy(context.nodes, 'id');
  let updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap> = context;

  context.initial_node_connections.forEach(connection => {
    ({ updatedContext } = updateConnectionEdges(
      updatedContext,
      nodeById[connection.from],
      nodeById[connection.to],
      true
    ));
  });

  return { edges: updatedContext.edges, nodes_connections: updatedContext.nodes_connnections };
}
