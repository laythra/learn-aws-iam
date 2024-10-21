import type { EditorView } from '@uiw/react-codemirror';
import type { ValidateFunction } from 'ajv';
import { produce, WritableDraft } from 'immer';
import _ from 'lodash';
import { Node, Edge } from 'reactflow';

import { EdgeConnectionFinishEvent } from '../level4/objectives/edge-connection-objectives';
import { GenericContext, LevelObjective, NodeCreationFinishEvent } from '../types';
import { createEdge } from '@/factories/edge-factory';
import { createPolicyNode } from '@/factories/policy-node-factory';
import {
  IAMAnyNodeData,
  IAMNodeEntity,
  type IAMPolicyNodeData,
  type IAMUserNodeData,
} from '@/types';
import { findAnyValidPolicy } from '@/utils/iam-code-linter';

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

      // TODO: Locked edges are deprecated, resolve edges manually through affected_resources instead
      draftEdges.push(...objective.locked_edges);

      sideEffectsEvents.push(objective.on_finish_event as EdgeConnectionFinishEvent);
    });

    Object.keys(policyNode.data.granted_accesses).forEach(resourceID => {
      const userToResourceEdge = createEdge({ source: userNode.id, target: resourceID });
      draftEdges.push(userToResourceEdge);
    });
  });

  return [newEdges, sideEffectsEvents];
}

export function changeLevelObjectiveProgress(
  context: GenericContext,
  id: string,
  finished: boolean
): LevelObjective[] {
  return produce(context.level_objectives, draftLevelObjectives => {
    const targetObjective = draftLevelObjectives.find(objective => objective.id === id);
    if (!targetObjective) return;

    targetObjective.finished = finished;
  });
}

export function createIAMPolicyNode(
  context: GenericContext,
  editorView: EditorView
): [Node[], NodeCreationFinishEvent[]] {
  const targetValidPolicy = findAnyValidPolicy(context.policy_role_objectives, editorView);
  const sideEffectsEvents: NodeCreationFinishEvent[] = [];

  const newNodes = produce(context.nodes, draftNodes => {
    const newPolicyNode = createPolicyNode({
      id: targetValidPolicy?.entity_id ?? new Date().getTime().toString(),
      content: editorView.state.doc.toString(),
      label: targetValidPolicy?.entity ?? IAMNodeEntity.Policy,
      unnecessary_policy: targetValidPolicy === undefined,
      code: editorView.state.doc.toString(),
    });

    draftNodes.push(newPolicyNode);
    if (targetValidPolicy) {
      sideEffectsEvents.push(targetValidPolicy.on_finish_event);
    }
  });

  return [newNodes, sideEffectsEvents];
}

export function updateIAMNode(
  context: GenericContext,
  nodeId: string,
  props: Partial<Omit<IAMAnyNodeData, 'entity'>>
): Node[] {
  return produce(context.nodes, draftNodes => {
    const targetNode = draftNodes.find(node => node.id === nodeId);
    if (!targetNode) return;

    targetNode.data = { ...targetNode.data, ...props };

    return draftNodes;
  });
}
