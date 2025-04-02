import { IAMNodeEntity } from '@/types';
import {
  IAMAnyNode,
  IAMGroupNode,
  IAMPolicyNode,
  IAMResourceNode,
  IAMRoleNode,
  IAMUserNode,
} from '@/types/iam-node-types';

// Define a mapping between each entity and its node data type.
export interface NodeByEntity {
  [IAMNodeEntity.Policy]: IAMPolicyNode;
  [IAMNodeEntity.User]: IAMUserNode;
  [IAMNodeEntity.Group]: IAMGroupNode;
  [IAMNodeEntity.Role]: IAMRoleNode;
  [IAMNodeEntity.Resource]: IAMResourceNode;
}

// Generic type guard that checks if a node is of a particular entity type.
export function isNodeOfEntity<E extends IAMNodeEntity>(
  node: IAMAnyNode,
  expected: E
): node is NodeByEntity[E] {
  return node.data.entity === expected;
}

export function isNodeOfAnyEntity<E extends IAMNodeEntity>(
  node: IAMAnyNode,
  expected: E[]
): node is NodeByEntity[E] {
  return expected.some(entity => node.data.entity === entity);
}
