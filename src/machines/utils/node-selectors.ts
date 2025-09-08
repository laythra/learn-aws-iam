import { IAMNodeFilter } from './iam-node-filter';
import { IAMAnyNode, IAMGuardRailsNode, IAMNodeEntity } from '@/types';

export function selectGuardRailsNodes(nodes: IAMAnyNode[]): IAMGuardRailsNode[] {
  return IAMNodeFilter.create()
    .fromNodes(nodes)
    .whereEntityIsOneOf(IAMNodeEntity.PermissionBoundary, IAMNodeEntity.SCP)
    .build() as IAMGuardRailsNode[];
}
