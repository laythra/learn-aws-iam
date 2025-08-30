// TODO: Git rid of this file or trim it. we don't need an extra `initial_connections` property on the context
// it only adds complexity. We should pass in the initial connections directly rather than make it a separate property
import _ from 'lodash';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { BaseFinishEventMap, GenericContext } from '../types';
import { HandleID, IAMEdge } from '@/types';

export function resolveInitialEdges<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>
): { edges: IAMEdge[] } {
  if (!context.initial_node_connections) {
    return { edges: [] };
  }

  const nodeById = _.keyBy(context.nodes, 'id');
  let updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap> = context;

  context.initial_node_connections.forEach(connection => {
    ({ updatedContext } = updateConnectionEdges(
      updatedContext,
      nodeById[connection.from],
      nodeById[connection.to],
      true,
      {
        targetHandle: connection.target_handle ?? HandleID.Bottom,
        sourceHandle: connection.source_handle ?? HandleID.Top,
      }
    ));
  });

  return { edges: updatedContext.edges };
}
