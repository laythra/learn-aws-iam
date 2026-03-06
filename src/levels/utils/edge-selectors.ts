import { ConnectionFilter } from './connection-filter';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

/**
 * computes outbound edges connected to the given node
 * @param edges all edges in the graph
 * @param node the node to check connections against
 * @returns an array of outbound nodes
 */
export function selectOutboundEdges(edges: IAMEdge[], node: IAMAnyNode): IAMEdge[] {
  return ConnectionFilter.create().fromEdges(edges).whereSourceIs(node.id).build();
}
