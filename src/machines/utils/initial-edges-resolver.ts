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
      const policyToUserEdge = createEdge({
        source: policyId,
        target: userNode.id,
        data: {
          hovering_label: 'Attached to',
        },
      });
      const policyNode = nodesById[policyId] as Node<IAMPolicyNodeData>;

      const userToResourceEdges = policyNode.data.granted_accesses.map(accessInfo => {
        return createEdge({
          source: userNode.id,
          target: accessInfo.target_node,
          targetHandle: accessInfo.target_handle,
          data: {
            hovering_label: accessInfo.access_level,
          },
        });
      });

      return [policyToUserEdge, userToResourceEdges];
    });
  });

  // TODO: Handle edges established through group nodes

  return policyEdges;
}
