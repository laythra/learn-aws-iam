import _ from 'lodash';
import { Edge, Node } from 'reactflow';

import {
  BaseFinishEventMap,
  EdgeConnectionObjective,
  GenericContext,
  ObjectiveType,
} from '../types';
import { createEdge, CreateEdgeProps } from '@/factories/edge-factory';
import { theme } from '@/theme';
import {
  IAMAnyNodeData,
  IAMEdgeData,
  IAMGroupNodeData,
  IAMNodeEntity,
  IAMPolicyNodeData,
  IAMResourceNodeData,
  IAMRoleNodeData,
  IAMUserNodeData,
  PolicyGrantedAccess,
} from '@/types';
import { getEdgeName, getEdgeLabel } from '@/utils/names';
import { isNodeOfEntity } from '@/utils/node-type-guards';

function isEdgeConnectionObjectiveFinished<TFinishEventMap extends BaseFinishEventMap>(
  objective: EdgeConnectionObjective<TFinishEventMap>,
  establishedEdges: Edge<IAMEdgeData>[]
): boolean {
  return _.differenceBy(objective.required_edges, establishedEdges, 'id').length === 0;
}

function isEdgeConnectionValid<TFinishEventMap extends BaseFinishEventMap>(
  objective: EdgeConnectionObjective<TFinishEventMap>,
  newEdgeId: string
): boolean {
  return objective.required_edges.some(edge => edge.id === newEdgeId);
}

function createEdgeWithEvents<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  sourceNode: Node<IAMAnyNodeData>,
  targetNode: Node<IAMAnyNodeData>
): { edge: Edge; events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] } {
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] = [];
  const insideTutorial = context.in_tutorial_state;
  const edgeLabel = getEdgeLabel(sourceNode.data.entity, targetNode.data.entity);
  let validEdge: Edge<IAMEdgeData> | undefined = undefined;

  const invalidEdge = createEdge({
    source: sourceNode.id,
    target: targetNode.id,
    animated: true,
    deletable: true,
    data: {
      hovering_label: insideTutorial ? 'Invalid Connection' : edgeLabel,
      hovering_color: insideTutorial ? theme.colors.red[500] : theme.colors.blue[500],
      color: insideTutorial ? theme.colors.yellow[500] : theme.colors.black,
      unnecessary_edge: true,
      label_always_visible: true,
    },
  });

  context.edges_connection_objectives
    .filter(objective => !objective.is_finished)
    .forEach(objective => {
      if (!isEdgeConnectionValid(objective, getEdgeName(sourceNode.id, targetNode.id))) {
        return;
      }

      const newEdgeData: CreateEdgeProps = {
        source: sourceNode.id,
        target: targetNode.id,
        targetHandle: objective.established_edge_target_handle,
        sourceHandle: objective.established_edge_source_handle,
        deletable: false,
        data: {
          hovering_label: edgeLabel,
        },
      };

      validEdge = createEdge(newEdgeData);
      if (isEdgeConnectionObjectiveFinished(objective, [...context.edges, validEdge])) {
        sideEffectsEvents.push(objective.on_finish_event);
      }
    });

  return {
    edge: validEdge ?? invalidEdge,
    events: sideEffectsEvents,
  };
}

/**
 * returns an array of edges created from the granted accesses of a policy
 * @param sourceId The id of the source node, from which the edge will be created
 * @param grantedAccesses The granted accesses of the policy
 * @param parentEdgeId The id of the parent edge that was responsible for the creation of these edges
 * @returns An array of edges
 */
function createEdgesFromGrantedAccesses(
  sourceId: string,
  grantedAccesses: PolicyGrantedAccess[],
  parentEdgeId: string
): Edge<IAMEdgeData>[] {
  return grantedAccesses.map(access =>
    createEdge({
      source: sourceId,
      target: access.target_node,
      targetHandle: access.target_handle,
      sourceHandle: access.source_handle,
      data: { hovering_label: access.access_level, parent_edge_id: parentEdgeId },
      deletable: false,
    })
  );
}

// --- Strategy Map ---
// Each strategy takes context, sourceNode, and targetNode,
// and returns an object with the new edges and any side effect events.
const connectionStrategies = {
  policyToUser: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMPolicyNodeData>,
    userNode: Node<IAMUserNodeData>
  ) => {
    const { edge: baseEdge, events } = createEdgeWithEvents(context, policyNode, userNode);
    const resourceEdges = createEdgesFromGrantedAccesses(
      userNode.id,
      policyNode.data.granted_accesses,
      baseEdge.id
    );

    return { edges: [baseEdge, ...resourceEdges], events };
  },

  policyToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMPolicyNodeData>,
    groupNode: Node<IAMGroupNodeData>
  ) => {
    const { edge: baseEdge, events } = createEdgeWithEvents(context, policyNode, groupNode);
    const userEdges = groupNode.data.associated_users.flatMap(userId =>
      createEdgesFromGrantedAccesses(userId, policyNode.data.granted_accesses, baseEdge.id)
    );
    return { edges: [baseEdge, ...userEdges], events };
  },

  policyToRole: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMPolicyNodeData>,
    roleNode: Node<IAMRoleNodeData>
  ) => {
    const { edge: baseEdge, events } = createEdgeWithEvents(context, policyNode, roleNode);
    const usersToResourcesEdges = roleNode.data.associated_users.flatMap(userId =>
      createEdgesFromGrantedAccesses(userId, policyNode.data.granted_accesses, baseEdge.id)
    );
    const resourcesToResourcesEdges = roleNode.data.associated_resources.flatMap(resourceId =>
      createEdgesFromGrantedAccesses(resourceId, policyNode.data.granted_accesses, baseEdge.id)
    );

    return { edges: [baseEdge, ...usersToResourcesEdges, ...resourcesToResourcesEdges], events };
  },

  userToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: Node<IAMUserNodeData>,
    groupNode: Node<IAMGroupNodeData>
  ) => {
    const { edge: baseEdge, events } = createEdgeWithEvents(context, userNode, groupNode);
    const nodeById = _.keyBy(context.nodes, 'id');

    const userToResourceEdges = groupNode.data.associated_policies.flatMap(policyId => {
      const policyNode = nodeById[policyId] as Node<IAMPolicyNodeData>;
      return createEdgesFromGrantedAccesses(
        userNode.id,
        policyNode.data.granted_accesses,
        baseEdge.id
      );
    });

    return { edges: [baseEdge, ...userToResourceEdges], events };
  },
  userToRole: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: Node<IAMUserNodeData>,
    roleNode: Node<IAMRoleNodeData>
  ) => {
    const { edge: baseEdge, events } = createEdgeWithEvents(context, userNode, roleNode);
    const nodeById = _.keyBy(context.nodes, 'id');

    const userToResourceNodes = roleNode.data.associated_policies.flatMap(policyId => {
      const policyNode = nodeById[policyId] as Node<IAMPolicyNodeData>;
      return createEdgesFromGrantedAccesses(
        userNode.id,
        policyNode.data.granted_accesses,
        baseEdge.id
      );
    });

    return { edges: [baseEdge, ...userToResourceNodes], events };
  },

  roleToResource: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    roleNode: Node<IAMRoleNodeData>,
    resourceNode: Node<IAMResourceNodeData>
  ) => {
    const { edge: baseEdge, events } = createEdgeWithEvents(context, roleNode, resourceNode);
    const nodeById = _.keyBy(context.nodes, 'id');

    const resourceToResourceEdges = roleNode.data.associated_policies.flatMap(policyId => {
      const policyNode = nodeById[policyId] as Node<IAMPolicyNodeData>;
      return createEdgesFromGrantedAccesses(
        resourceNode.id,
        policyNode.data.granted_accesses,
        baseEdge.id
      );
    });

    return { edges: [baseEdge, ...resourceToResourceEdges], events };
  },
} as const;

// --- Generic Connection Updater ---
// Determines the connection type and applies the corresponding strategy.
export function updateConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  sourceNode: Node<IAMAnyNodeData>,
  targetNode: Node<IAMAnyNodeData>
): {
  edges: Edge<IAMEdgeData>[];
  events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][];
} {
  if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.User)
  ) {
    return connectionStrategies.policyToUser(context, sourceNode, targetNode);
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Group)
  ) {
    return connectionStrategies.policyToGroup(context, sourceNode, targetNode);
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Role)
  ) {
    return connectionStrategies.policyToRole(context, sourceNode, targetNode);
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.User) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Group)
  ) {
    return connectionStrategies.userToGroup(context, sourceNode, targetNode);
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.User) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Role)
  ) {
    return connectionStrategies.userToRole(context, sourceNode, targetNode);
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Role) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Resource)
  ) {
    return connectionStrategies.roleToResource(context, sourceNode, targetNode);
  }

  throw new Error('Unsupported connection type');
}
