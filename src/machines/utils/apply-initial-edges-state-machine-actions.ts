// TODO: Git rid of this file or trim it. we don't need an extra `initial_connections` property on the context
// it only adds complexity. We should pass in the initial connections directly rather than make it a separate property
// The file feels like it shoudl called directly from common-state-machine-setup or at least included directly inside edges-creation-state-machine-actions
import _ from 'lodash';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { BaseFinishEventMap, GenericContext, InitialNodeConnection } from '../types';
import { HandleID, IAMEdge } from '@/types';

export function applyInitialNodeConnections<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  initialConnections: InitialNodeConnection[]
): { edges: IAMEdge[] } {
  const nodeById = _.keyBy(context.nodes, 'id');
  let updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap> = context;

  initialConnections.forEach(connection => {
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
