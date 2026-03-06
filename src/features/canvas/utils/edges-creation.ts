import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

const VALID_CONNECTIONS = new Set<string>(
  [
    [IAMNodeEntity.IdentityPolicy, IAMNodeEntity.User],
    [IAMNodeEntity.IdentityPolicy, IAMNodeEntity.Group],
    [IAMNodeEntity.ResourcePolicy, IAMNodeEntity.Resource],
    [IAMNodeEntity.User, IAMNodeEntity.Group],
    [IAMNodeEntity.User, IAMNodeEntity.Role],
    [IAMNodeEntity.IdentityPolicy, IAMNodeEntity.Role],
    [IAMNodeEntity.Resource, IAMNodeEntity.Role],
    [IAMNodeEntity.OU, IAMNodeEntity.Account],
    [IAMNodeEntity.SCP, IAMNodeEntity.OU],
    [IAMNodeEntity.SCP, IAMNodeEntity.Account],
    [IAMNodeEntity.PermissionBoundary, IAMNodeEntity.User],
    [IAMNodeEntity.PermissionBoundary, IAMNodeEntity.Role],
  ].map(([source, target]) => `${source}-${target}`)
);

/**
 * To allow bidirectional connections, we check both directions.
 * If the connection is valid in either direction, we return the nodes ordered
 * in the canonical direction as defined by VALID_CONNECTIONS
 * @param sourceNode source node of the connection
 * @param targetNode target node of the connection
 * @returns an object with { source, target } in the canonical direction if valid (possibly swapped), otherwise undefined
 */
export const getValidConnectionDirection = (
  sourceNode: IAMAnyNode,
  targetNode: IAMAnyNode
): { source: IAMAnyNode; target: IAMAnyNode } | undefined => {
  const path1 = `${sourceNode.data.entity}-${targetNode.data.entity}`;
  const path2 = `${targetNode.data.entity}-${sourceNode.data.entity}`;

  if (VALID_CONNECTIONS.has(path1)) {
    return { source: sourceNode, target: targetNode };
  }

  if (VALID_CONNECTIONS.has(path2)) {
    return { source: targetNode, target: sourceNode };
  }
};
