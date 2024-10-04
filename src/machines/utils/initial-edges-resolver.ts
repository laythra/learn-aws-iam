import _ from 'lodash';
import { Edge, Node } from 'reactflow';

import { createEdge } from '@/factories/edge-factory';
import { IAMAnyNodeData, IAMNodeEntity, IAMPolicyNodeData, IAMUserNodeData } from '@/types';

export function resolveInitialEdges(initialNodes: Node<IAMAnyNodeData>[]): Edge[] {
  const nodesById = _.keyBy(initialNodes, 'id');
  const nodesByEntity = _.groupBy(initialNodes, 'data.entity');
  const userNodes = nodesByEntity[IAMNodeEntity.User] as Node<IAMUserNodeData>[];

  const policyEdges = _.flatMapDeep(userNodes, userNode => {
    return userNode.data.associated_policies.map(policyId => {
      const policyToUserEdge = createEdge({ source: policyId, target: userNode.id });
      const policyNode = nodesById[policyId] as Node<IAMPolicyNodeData>;

      const userToResourceEdges = policyNode.data.resources_affected.map(resourceId => {
        return createEdge({ source: userNode.id, target: resourceId });
      });

      return [policyToUserEdge, userToResourceEdges];
    });
  });

  // TODO: Handle edges established through group nodes

  return policyEdges;
}
