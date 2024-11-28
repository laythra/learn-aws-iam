import { produce, WritableDraft } from 'immer';
import _ from 'lodash';
import { Node, Edge } from 'reactflow';

import {
  BaseFinishEventMap,
  GenericContext,
  IAMUserGroupCreationObjective,
  LevelObjective,
  ObjectiveType,
} from '../types';
import { createEdge } from '@/factories/edge-factory';
import { createGroupNode } from '@/factories/group-node-factory';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { createUserNode } from '@/factories/user-node-factory';
import {
  IAMEdgeData,
  IAMGroupNodeData,
  IAMNodeEntity,
  type IAMPolicyNodeData,
  type IAMUserNodeData,
} from '@/types';
import { PartialWithRequired } from '@/types/common';
import { findAnyValidPolicy, isJSONValid } from '@/utils/iam-code-linter';
import { getEdgeName } from '@/utils/names';

export function attachPolicyToEntity<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  policyNode: Node<IAMPolicyNodeData>,
  entityNode: Node<IAMUserNodeData | IAMGroupNodeData>
): Node[] {
  return produce(context.nodes, draftNodes => {
    const targetNode = draftNodes.find(
      node => node.id === entityNode.id && node.data.entity === entityNode.data.entity
    );
    if (!targetNode) return;

    (
      targetNode as WritableDraft<Node<IAMUserNodeData | IAMGroupNodeData>>
    ).data.associated_policies.push(policyNode.id);
  });
}

export function attachUserToGroup<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  userNode: Node<IAMUserNodeData>,
  groupNode: Node<IAMGroupNodeData>
): Node[] {
  return produce(context.nodes, draftNodes => {
    const targetNode = draftNodes.find(node => node.id === groupNode.id);
    if (!targetNode) return;

    (targetNode as WritableDraft<Node<IAMGroupNodeData>>).data.associated_users.push(userNode.id);
  });
}

function updatePolicyToUserConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  policyNode: Node<IAMPolicyNodeData>,
  userNode: Node<IAMUserNodeData>
): [Edge[], TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][]] {
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] = [];
  const newEdges = produce(context.edges, draftEdges => {
    let newEdgeData: PartialWithRequired<Edge<IAMEdgeData>, 'source' | 'target'> = {
      source: policyNode.id,
      target: userNode.id,
      data: {
        hovering_label: 'Attached to',
      },
    };
    draftEdges.push(createEdge(newEdgeData));

    context.edges_connection_objectives.forEach(objective => {
      if (objective.is_finished) return;

      const objectiveAchieved =
        _.differenceBy(objective.required_edges, draftEdges, 'id').length === 0;

      if (!objectiveAchieved) {
        return;
      }

      newEdgeData = {
        ...newEdgeData,
        targetHandle: objective.established_edge_target_handle,
      };

      draftEdges.pop();
      draftEdges.push(createEdge(newEdgeData));
      sideEffectsEvents.push(objective.on_finish_event);
    });

    policyNode.data.granted_accesses.forEach(accessInfo => {
      const userToResourceEdge = createEdge({
        source: userNode.id,
        target: accessInfo.target_node,
        targetHandle: accessInfo.target_handle,
        data: { hovering_label: accessInfo.access_level },
      });

      draftEdges.push(userToResourceEdge);
    });
  });

  return [newEdges, sideEffectsEvents];
}

function updatePolicyToGroupConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  policyNode: Node<IAMPolicyNodeData>,
  groupNode: Node<IAMGroupNodeData>
): [Edge[], TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][]] {
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] = [];
  const newEdges = produce(context.edges, draftEdges => {
    let newEdgeData: PartialWithRequired<Edge<IAMEdgeData>, 'source' | 'target'> = {
      source: policyNode.id,
      target: groupNode.id,
      data: {
        hovering_label: 'Attached to',
      },
    };
    draftEdges.push(createEdge(newEdgeData));

    context.edges_connection_objectives.forEach(objective => {
      if (objective.is_finished) return;

      const objectiveAchieved =
        _.differenceBy(objective.required_edges, draftEdges, 'id').length === 0;

      if (!objectiveAchieved) {
        return;
      }

      newEdgeData = {
        ...newEdgeData,
        targetHandle: objective.established_edge_target_handle,
      };

      draftEdges.pop();
      draftEdges.push(createEdge(newEdgeData));
      sideEffectsEvents.push(objective.on_finish_event);
    });

    console.log(policyNode.data.granted_accesses);
    policyNode.data.granted_accesses.forEach(accessInfo => {
      const userToResourceEdges = groupNode.data.associated_users.map(userNodeId =>
        createEdge({
          source: userNodeId,
          target: accessInfo.target_node,
          targetHandle: accessInfo.target_handle,
          data: { hovering_label: accessInfo.access_level },
        })
      );

      draftEdges.push(...userToResourceEdges);
    });
  });

  return [newEdges, sideEffectsEvents];
}

export function updateUserToGroupConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  userNode: Node<IAMUserNodeData>,
  groupNode: Node<IAMGroupNodeData>
): [Edge[], TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][]] {
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] = [];
  const newEdges = produce(context.edges, draftEdges => {
    let newEdgeData: PartialWithRequired<Edge<IAMEdgeData>, 'source' | 'target'> = {
      source: userNode.id,
      target: groupNode.id,
      data: {
        hovering_label: 'Belongs to',
      },
    };
    draftEdges.push(createEdge(newEdgeData));

    context.edges_connection_objectives.forEach(objective => {
      if (objective.is_finished) return;

      const objectiveAchieved =
        _.differenceBy(objective.required_edges, draftEdges, 'id').length === 0;

      if (!objectiveAchieved) {
        return;
      }

      newEdgeData = {
        ...newEdgeData,
        targetHandle: objective.established_edge_target_handle,
      };

      draftEdges.pop();
      draftEdges.push(createEdge(newEdgeData));
      sideEffectsEvents.push(objective.on_finish_event);
    });

    const policyNodes = _.chain(context.nodes)
      .filter((node): node is Node<IAMPolicyNodeData> => node.data.entity === IAMNodeEntity.Policy)
      .keyBy('id')
      .value();

    const resourcesGrantedByGroup = groupNode.data.associated_policies.flatMap(policyId => {
      return policyNodes[policyId].data.granted_accesses;
    });

    resourcesGrantedByGroup.forEach(grantedAccess => {
      const userToResourceEdges = createEdge({
        source: userNode.id,
        target: grantedAccess.target_node,
        targetHandle: grantedAccess.target_handle,
        data: { hovering_label: grantedAccess.access_level },
      });

      draftEdges.push(userToResourceEdges);
    });
  });

  return [newEdges, sideEffectsEvents];
}

export function updatePolicyToEntityConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  policyNode: Node<IAMPolicyNodeData>,
  entityNode: Node<IAMUserNodeData | IAMGroupNodeData>
): [Edge[], TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][]] {
  if (entityNode.data.entity === IAMNodeEntity.User) {
    return updatePolicyToUserConnectionEdges(
      context,
      policyNode,
      entityNode as Node<IAMUserNodeData>
    );
  } else if (entityNode.data.entity === IAMNodeEntity.Group) {
    return updatePolicyToGroupConnectionEdges(
      context,
      policyNode,
      entityNode as Node<IAMGroupNodeData>
    );
  } else {
    throw new Error('Invalid entity type');
  }
}

export function changeLevelObjectiveProgress<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  id: string,
  finished: boolean
): LevelObjective<TLevelObjectiveID, TFinishEventMap>[] {
  return produce(context.level_objectives, draftLevelObjectives => {
    const targetObjective = draftLevelObjectives.find(objective => objective.id === id);
    if (!targetObjective) return;

    targetObjective.finished = finished;
  });
}

export function createIAMPolicyNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string
): [Node[], TFinishEventMap[ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE][]] {
  const targetValidPolicy = findAnyValidPolicy(context.policy_role_objectives, docString);
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE][] = [];

  const newNodes = produce(context.nodes, draftNodes => {
    const newPolicyNode = createPolicyNode({
      id: targetValidPolicy?.entity_id ?? new Date().getTime().toString(),
      content: docString,
      label: targetValidPolicy?.entity ?? IAMNodeEntity.Policy,
      unnecessary_policy: targetValidPolicy === undefined,
    });

    draftNodes.push(newPolicyNode);
    if (targetValidPolicy) {
      sideEffectsEvents.push(targetValidPolicy.on_finish_event);
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
export function editIAMPolicyNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeId: string,
  docString: string
): [Node[], Edge[], TFinishEventMap[ObjectiveType.POLICY_ROLE_EDIT_OBJECTIVE][]] {
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

  return [updatedNodes, newEdges, [targetEditObjective.on_finish_event]];
}

/**
 *  Edits the state of an objective, namely the `finished` property.
 * @param context The current state machine context
 * @param objectiveId The ID of the objective to edit
 * @param finished The new `finished` state of the objective
 * @returns Updated array of level objectives.
 */
export function editObjectiveState<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  objectiveId: string,
  finished: boolean
): LevelObjective<TLevelObjectiveID, TFinishEventMap>[] {
  return produce(context.level_objectives, draftLevelObjectives => {
    const targetObjective = draftLevelObjectives.find(objective => objective.id === objectiveId);
    if (!targetObjective) return;

    targetObjective.finished = finished;
  });
}

/**
 * Creates a new IAM user/group node and checks if an associated user/group creation objective is finished.
 * If the user/group creation objective is finished, the `on_finish_event` is pushed to the `finishEvents` array.
 * @param context The current state machine context
 * @param nodeType The type of the new node to create, either a user or group
 * @param props The properties of the new user/group node
 * @returns A tuple containing the updated nodes and finish events.
 */
export function createIAMUserGroupNode<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeType: IAMNodeEntity.Group | IAMNodeEntity.User,
  props: Omit<Partial<IAMGroupNodeData>, 'entity'> | Omit<Partial<IAMUserNodeData>, 'entity'>
): [
  Node[],
  IAMUserGroupCreationObjective<TFinishEventMap>[],
  TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE][],
] {
  const targetObjective = context.user_group_creation_objectives.find(
    objective => objective.entity_to_create === nodeType && !objective.finished
  );

  let newNode: Node<IAMGroupNodeData> | Node<IAMUserNodeData>;
  const newNodes = produce(context.nodes, draftNodes => {
    const creationFunc = nodeType === IAMNodeEntity.Group ? createGroupNode : createUserNode;

    newNode = creationFunc({
      id: targetObjective?.entity_id ?? new Date().getTime().toString(),
      initial_position: targetObjective?.initial_position ?? 'center',
      ...props,
    });

    draftNodes.push(newNode);
  });

  let updatedObjectives: IAMUserGroupCreationObjective<TFinishEventMap>[] =
    context.user_group_creation_objectives;

  if (targetObjective) {
    updatedObjectives = produce(context.user_group_creation_objectives, draftObjectives => {
      draftObjectives.find(
        objective => objective.entity_id === targetObjective.entity_id
      )!.finished = true;
    });
  }

  const finishEvents = targetObjective ? [targetObjective.on_finish_event] : [];
  return [newNodes, updatedObjectives, finishEvents];
}
