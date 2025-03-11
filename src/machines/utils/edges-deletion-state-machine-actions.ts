import { produce } from 'immer';
import _ from 'lodash';
import { Edge, Node } from 'reactflow';

import { BaseFinishEventMap, GenericContext } from '../types';
import { IAMAnyNodeData, IAMEdgeData, IAMNodeEntity } from '@/types';
import { isNodeOfAnyEntity, isNodeOfEntity } from '@/utils/node-type-guards';

/**
 * Helper: Updates node associations based on the deletion of an edge.
 *
 * This inspects the edge’s source and target nodes (using the context's node collection)
 * and updates their associated arrays accordingly
 *
 * @param context - The current context containing nodes.
 * @param edgeToDelete - The edge that is about to be deleted.
 */
function updateNodeAssociationsOnEdgeDeletion<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  edgeToDelete: Edge<IAMEdgeData>
): Node<IAMAnyNodeData>[] {
  const { source, target } = edgeToDelete;

  // Use Immer to produce a fresh copy of the array with the necessary updates.
  return produce(context.nodes, draftNodes => {
    const draftNodeById = _.keyBy(draftNodes, 'id');
    const draftSourceNode = draftNodeById[source];
    const draftTargetNode = draftNodeById[target];

    if (!draftSourceNode || !draftTargetNode) {
      return;
    }

    if (
      isNodeOfEntity(draftSourceNode, IAMNodeEntity.Policy) &&
      isNodeOfAnyEntity(draftTargetNode, [
        IAMNodeEntity.User,
        IAMNodeEntity.Group,
        IAMNodeEntity.Role,
      ])
    ) {
      draftTargetNode.data.associated_policies = draftTargetNode.data.associated_policies.filter(
        policyId => policyId !== draftSourceNode.id
      );
    }

    if (
      isNodeOfEntity(draftSourceNode, IAMNodeEntity.User) &&
      isNodeOfAnyEntity(draftTargetNode, [IAMNodeEntity.Group, IAMNodeEntity.Role])
    ) {
      draftTargetNode.data.associated_policies = draftTargetNode.data.associated_policies.filter(
        policyId => policyId !== draftSourceNode.id
      );
    }

    if (
      isNodeOfEntity(draftSourceNode, IAMNodeEntity.Role) &&
      isNodeOfAnyEntity(draftTargetNode, [IAMNodeEntity.Resource])
    ) {
      draftTargetNode.data.associated_roles = draftTargetNode.data.associated_roles.filter(
        roleId => roleId !== draftSourceNode.id
      );
    }
  });
}

/**
 * Deletes an edge from the context and all its children
 *  and updates connection objectives and node associations.
 *
 * @param context - The current generic context containing nodes, edges, and objectives.
 * @param edgeToDelete - The edge that should be deleted.
 * @returns An object with the updated edges list and any events related to connection objectives.
 */
export function deleteConnectionEdge<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  edgeToDelete: Edge<IAMEdgeData>
): { updatedEdges: Edge<IAMEdgeData>[]; updatedNodes: Node<IAMAnyNodeData>[] } {
  const updatedNodes = updateNodeAssociationsOnEdgeDeletion(context, edgeToDelete);
  const updatedEdges = context.edges.filter(
    edge => edge.id !== edgeToDelete.id && edge.data?.parentEdgeId !== edgeToDelete.id
  );

  return { updatedEdges, updatedNodes };
}
