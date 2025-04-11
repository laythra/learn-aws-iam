import { IAMNodeEntity } from '@/types';
import { IAMAnyNode } from '@/types/iam-node-types';

const VALID_CONNECTIONS = new Set<string>(
  [
    [IAMNodeEntity.Policy, IAMNodeEntity.User],
    [IAMNodeEntity.Policy, IAMNodeEntity.Group],
    [IAMNodeEntity.Policy, IAMNodeEntity.Resource],
    [IAMNodeEntity.User, IAMNodeEntity.Group],
    [IAMNodeEntity.User, IAMNodeEntity.Role],
    [IAMNodeEntity.Policy, IAMNodeEntity.Role],
    [IAMNodeEntity.Resource, IAMNodeEntity.Role],
    [IAMNodeEntity.OU, IAMNodeEntity.Account],
  ].map(([source, target]) => `${source}-${target}`)
);

export const isValidConnection = (sourceNode: IAMAnyNode, targetNode: IAMAnyNode): boolean => {
  const connectionKey = `${sourceNode.data.entity}-${targetNode.data.entity}`;

  return VALID_CONNECTIONS.has(connectionKey);
};
