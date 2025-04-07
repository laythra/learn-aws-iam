import { IAMNodeEntity } from '@/types';
import { IAMAnyNode, IAMNodeMap } from '@/types/iam-node-types';

// Generic type guard that checks if a node is of a particular entity type.
export function isNodeOfEntity<E extends IAMNodeEntity>(
  node: IAMAnyNode,
  expected: E
): node is IAMNodeMap[E] {
  return node.data.entity === expected;
}

export function isNodeOfAnyEntity<E extends IAMNodeEntity>(
  node: IAMAnyNode,
  expected: E[]
): node is IAMNodeMap[E] {
  return expected.some(entity => node.data.entity === entity);
}
