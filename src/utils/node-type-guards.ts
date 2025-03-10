import { Node } from 'reactflow';

import {
  IAMAnyNodeData,
  IAMNodeEntity,
  IAMPolicyNodeData,
  IAMUserNodeData,
  IAMGroupNodeData,
  IAMRoleNodeData,
  IAMResourceNodeData,
} from '@/types';

// Define a mapping between each entity and its node data type.
export interface NodeDataByEntity {
  [IAMNodeEntity.Policy]: IAMPolicyNodeData;
  [IAMNodeEntity.User]: IAMUserNodeData;
  [IAMNodeEntity.Group]: IAMGroupNodeData;
  [IAMNodeEntity.Role]: IAMRoleNodeData;
  [IAMNodeEntity.Resource]: IAMResourceNodeData;
}

// Generic type guard that checks if a node is of a particular entity type.
export function isNodeOfEntity<E extends IAMNodeEntity>(
  node: Node<IAMAnyNodeData>,
  expected: E
): node is Node<NodeDataByEntity[E]> {
  return node.data.entity === expected;
}

export function isNodeOfAnyEntity(node: Node<IAMAnyNodeData>, expected: IAMNodeEntity[]): boolean {
  return expected.includes(node.data.entity);
}
