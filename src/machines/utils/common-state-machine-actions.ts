import { produce, WritableDraft } from 'immer';
import _ from 'lodash';
import { Node, Edge } from 'reactflow';

import { EdgeConnectionFinishEvent } from '../level4/objectives/edge-connection-objectives';
import {
  GenericContext,
  IAMPolicyRoleCreationObjective,
  LevelObjective,
  NodeCreationFinishEvent,
} from '../types';
import { createEdge } from '@/factories/edge-factory';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { IAMNodeEntity, type IAMPolicyNodeData, type IAMUserNodeData } from '@/types';
import { findAnyValidPolicy, isJSONValid } from '@/utils/iam-code-linter';
import { getEdgeName } from '@/utils/names';

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
  docString: string
): [Node[], NodeCreationFinishEvent[]] {
  const targetValidPolicy = findAnyValidPolicy(context.policy_role_objectives, docString);
  const sideEffectsEvents: NodeCreationFinishEvent[] = [];

  const newNodes = produce(context.nodes, draftNodes => {
    const newPolicyNode = createPolicyNode({
      id: targetValidPolicy?.entity_id ?? new Date().getTime().toString(),
      content: docString,
      label: targetValidPolicy?.entity ?? IAMNodeEntity.Policy,
      unnecessary_policy: targetValidPolicy === undefined,
    });

    draftNodes.push(newPolicyNode);
    if (targetValidPolicy) {
      sideEffectsEvents.push((targetValidPolicy as IAMPolicyRoleCreationObjective).on_finish_event);
    }
  });

  return [newNodes, sideEffectsEvents];
}

/**
 * Edits the IAM Policy and checks if an associated edit objective is finished.
 *
 * If the edit objective is finished, the following happens:
 * - The objective's `on_finish_event` is pushed to the `nodeEditFinishEvents` array to be triggered.
 * - All associated users and groups have their edges updated according to the finished objective's
 *   `granted_accesses` and `revoked_accesses` properties.
 *
 * @template TEditFinishEvent - An enum representing the edit finish event.
 * @param context The current state machine context
 * @param nodeId The node ID of the policy being edited
 * @returns Updated array of node edit finish events.
 */
export function editIAMPolicyNode<TEditFinishEvent>(
  context: GenericContext,
  nodeId: string,
  docString: string
): [Node[], Edge[], TEditFinishEvent[]] {
  const targetEditObjective = context.policy_role_edit_objectives.find(
    objective => objective.entity_id === nodeId
  );

  if (!targetEditObjective || !isJSONValid(docString, targetEditObjective.validate_function)) {
    return [context.nodes, context.edges, []];
  }

  const updatedNodes = produce(context.nodes, draftNodes => {
    const targetNode = draftNodes.find(
      node => node.id === nodeId && node.data.entity === IAMNodeEntity.Policy
    ) as WritableDraft<Node<IAMPolicyNodeData>>;
    if (!targetNode) return;

    targetNode.data.content = docString;
    targetNode.data.editable = false;
  });

  const affectedUsers = context.nodes.filter(
    node =>
      node.data.entity === IAMNodeEntity.User && node.data.associated_policies.includes(nodeId)
  );

  const edgesToRemove = _.flatMap(affectedUsers, userNode => {
    return targetEditObjective.resources_to_revoke.map(resourceId =>
      getEdgeName(userNode.id, resourceId)
    );
  });

  const edgesToAdd = _.flatMap(
    targetEditObjective.resources_to_grant,
    (accessLevel, resourceId) => {
      return affectedUsers.map(userNode =>
        createEdge({
          source: userNode.id,
          target: resourceId,
          data: {
            hovering_label: accessLevel,
          },
        })
      );
    }
  );

  const newEdges = _.chain(context.edges)
    .reject(edge => edgesToRemove.includes(edge.id))
    .concat(edgesToAdd)
    .value();

  return [updatedNodes, newEdges, [targetEditObjective.on_finish_event as TEditFinishEvent]];
}

/**
 *  Edits the state of an objective, namely the `finished` property.
 * @param context The current state machine context
 * @param objectiveId The ID of the objective to edit
 * @param finished The new `finished` state of the objective
 * @returns Updated array of level objectives.
 */
export function editObjectiveState(
  context: GenericContext,
  objectiveId: string,
  finished: boolean
): LevelObjective[] {
  return produce(context.level_objectives, draftLevelObjectives => {
    const targetObjective = draftLevelObjectives.find(objective => objective.id === objectiveId);
    if (!targetObjective) return;

    targetObjective.finished = finished;
  });
}
