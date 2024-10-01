import { Edge, Node } from 'reactflow';

import { createEdge } from '@/factories/edge-factory';
import { IAMUserNodeData, IAMGroupNodeData } from '@/types';

export function resolveInitialEdges(
  initialUserNodes: Node<IAMUserNodeData>[],
  initialGroupNodes: Node<IAMGroupNodeData>[]
): Edge[] {
  const policyEdges = initialUserNodes.flatMap(userNode => {
    return userNode.data.associated_policies.map(policyId => {
      return createEdge({
        source: policyId,
        target: userNode.id,
        sourceHandle: 'top',
        targetHandle: 'bottom',
      });
    });
  });

  const groupEdges = initialGroupNodes.flatMap(groupNode => {
    return groupNode.data.attached_users.map(user => {
      return createEdge({
        source: user.id,
        target: groupNode.id,
        sourceHandle: 'top',
        targetHandle: 'bottom',
      });
    });
  });

  return [...policyEdges, ...groupEdges];
}
