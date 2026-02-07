import { ConnectionFilter } from './connection-filter';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge, IAMGuardRailsNode } from '@/types/iam-node-types';

/**
 *  computes the guard rails nodes that have connections to the target node
 * @param edges all edges in the graph
 * @param target the  target node to check connections against
 * @returns an array of guard rails nodes
 */
export function selectAffectingPermissionBoundaryNodes(
  edges: IAMEdge[],
  target: IAMAnyNode
): IAMGuardRailsNode[] {
  return ConnectionFilter.create()
    .fromEdges(edges)
    .whereSourceEntityIs(IAMNodeEntity.PermissionBoundary)
    .whereTargetIs(target.id)
    .build()
    .map(edge => edge.data?.source_node as IAMGuardRailsNode);
}

export function selectAffectingSCPNodes(edges: IAMEdge[], target: IAMAnyNode): IAMGuardRailsNode[] {
  const targets = [target.data.account_id, target.data.ou_id].filter(Boolean) as string[];
  if (targets.length === 0) {
    return [];
  }

  return ConnectionFilter.create()
    .fromEdges(edges)
    .whereSourceEntityIn([IAMNodeEntity.SCP])
    .whereTargetIn(targets)
    .build()
    .map(edge => edge.data?.source_node as IAMGuardRailsNode);
}
