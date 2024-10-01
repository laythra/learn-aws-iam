import { produce, WritableDraft } from 'immer';
import _ from 'lodash';
import { Node, Edge } from 'reactflow';

import { EdgeConnectionFinishEvent } from '../level4/objectives/edge-connection-objectives';
import { GenericContext } from '../types';
import { createEdge } from '@/factories/edge-factory';
import type { IAMPolicyNodeData, IAMUserNodeData } from '@/types';

export function attachPolicyToUser(
  context: GenericContext,
  policyNode: Node<IAMPolicyNodeData>,
  userNode: Node<IAMUserNodeData>
): Node[] {
  return produce(context.nodes, draftNodes => {
    const targetNode = draftNodes.find(node => node.id === userNode.id);
    if (!targetNode) return;

    (targetNode as WritableDraft<Node<IAMUserNodeData>>).data.associated_policies.push(
      policyNode.id
    );
  });
}

export function updatePolicyToUserConnectionEdges(
  context: GenericContext,
  policyNode: Node<IAMPolicyNodeData>,
  userNode: Node<IAMUserNodeData>
): [Edge[], EdgeConnectionFinishEvent[]] {
  const sideEffectsEvents: EdgeConnectionFinishEvent[] = [];
  const newEdges = produce(context.edges, draftEdges => {
    const newEdge = createEdge({ source: policyNode.id, target: userNode.id });
    draftEdges.push(newEdge);

    context.edges_connection_objectives.forEach(objective => {
      if (objective.is_finished) return;

      const objectiveAchieved =
        _.differenceBy(objective.required_edges, draftEdges, 'id').length === 0;

      if (!objectiveAchieved) return;

      draftEdges.push(...objective.locked_edges);

      sideEffectsEvents.push(objective.on_finish_event as EdgeConnectionFinishEvent);
    });
  });

  return [newEdges, sideEffectsEvents];
}
