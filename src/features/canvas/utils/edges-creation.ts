import { Node } from 'reactflow';

import { IAMAnyNodeData, IAMNodeEntity } from '@/types';

const VALID_CONNECTIONS = new Set<string>(
  [
    [IAMNodeEntity.Policy, IAMNodeEntity.User],
    [IAMNodeEntity.Policy, IAMNodeEntity.Group],
    [IAMNodeEntity.User, IAMNodeEntity.Group],
    [IAMNodeEntity.Role, IAMNodeEntity.User],
    [IAMNodeEntity.Policy, IAMNodeEntity.Role],
    [IAMNodeEntity.Role, IAMNodeEntity.Resource],
  ].map(([source, target]) => `${source}-${target}`)
);

export const isValidConnection = (
  sourceNode: Node<IAMAnyNodeData>,
  targetNode: Node<IAMAnyNodeData>
): boolean => {
  const connectionKey = `${sourceNode}-${targetNode}`;

  return VALID_CONNECTIONS.has(connectionKey);
};
