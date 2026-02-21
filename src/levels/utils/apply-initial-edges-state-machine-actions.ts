import _ from 'lodash';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { GenericContext } from '../types/context-types';
import { BaseFinishEventMap } from '../types/objective-types';
import { HandleID } from '@/types/iam-enums';
import { IAMEdge, InitialNodeConnection } from '@/types/iam-node-types';

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
