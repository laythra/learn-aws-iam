import _, { create } from 'lodash';
import { Edge, Node } from 'reactflow';

import {
  BaseFinishEventMap,
  EdgeConnectionObjective,
  GenericContext,
  ObjectiveType,
} from '../types';
import { createEdge } from '@/factories/edge-factory';
import {
  IAMAnyNodeData,
  IAMEdgeData,
  IAMGroupNodeData,
  IAMNodeEntity,
  IAMPolicyNodeData,
  IAMRoleNodeData,
  IAMUserNodeData,
  PolicyGrantedAccess,
} from '@/types';
import { PartialWithRequired } from '@/types/common';
import { isNodeOfEntity } from '@/utils/node-type-guards';

function isEdgeConnectionObjectiveFinished<TFinishEventMap extends BaseFinishEventMap>(
  objective: EdgeConnectionObjective<TFinishEventMap>,
  establishedEdges: Edge<IAMEdgeData>[]
): boolean {
  return _.differenceBy(objective.required_edges, establishedEdges, 'id').length === 0;
}

function createEdgeWithEvents<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  sourceNode: Node<IAMAnyNodeData>,
  targetNode: Node<IAMAnyNodeData>
): { edge: Edge; events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] } {
  let newEdgeData: PartialWithRequired<Edge<IAMEdgeData>, 'source' | 'target'> = {
    source: sourceNode.id,
    target: targetNode.id,
    data: {
      hovering_label: 'Attached to',
    },
  };

  let newEdge: Edge<IAMEdgeData>;
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] = [];

  context.edges_connection_objectives
    .filter(objective => !objective.is_finished)
    .forEach(objective => {
      newEdgeData = {
        ...newEdgeData,
        targetHandle: objective.established_edge_target_handle,
        sourceHandle: objective.established_edge_source_handle,
        deletable: false, // Once an objective is finished, its associated edge should not be deletable
        data: {
          hovering_label: objective.established_edge_hovering_label,
        },
      };

      newEdge = createEdge(newEdgeData);

      if (!isEdgeConnectionObjectiveFinished(objective, [...context.edges, newEdge])) {
        return;
      }
      sideEffectsEvents.push(objective.on_finish_event);
    });

  newEdge ??= createEdge(newEdgeData);
  return { edge: newEdge, events: sideEffectsEvents };
}

// Helper: Create edges based on granted accesses
function createEdgesFromGrantedAccesses(
  sourceId: string,
  grantedAccesses: PolicyGrantedAccess[]
): Edge<IAMEdgeData>[] {
  return grantedAccesses.map(access =>
    createEdge({
      source: sourceId,
      target: access.target_node,
      targetHandle: access.target_handle,
      sourceHandle: access.source_handle,
      data: { hovering_label: access.access_level },
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
      policyNode.data.granted_accesses
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
      createEdgesFromGrantedAccesses(userId, policyNode.data.granted_accesses)
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
      createEdgesFromGrantedAccesses(userId, policyNode.data.granted_accesses)
    );
    const resourcesToResourcesEdges = roleNode.data.associated_resources.flatMap(resourceId =>
      createEdgesFromGrantedAccesses(resourceId, policyNode.data.granted_accesses)
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
      return createEdgesFromGrantedAccesses(userNode.id, policyNode.data.granted_accesses);
    });

    return { edges: [baseEdge, ...userToResourceEdges], events };
  },
  roleToUser: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    roleNode: Node<IAMRoleNodeData>,
    userNode: Node<IAMUserNodeData>
  ) => {
    const { edge: baseEdge, events } = createEdgeWithEvents(context, roleNode, userNode);
    const nodeById = _.keyBy(context.nodes, 'id');

    const userToResourceNodes = roleNode.data.associated_policies.flatMap(policyId => {
      const policyNode = nodeById[policyId] as Node<IAMPolicyNodeData>;
      return createEdgesFromGrantedAccesses(userNode.id, policyNode.data.granted_accesses);
    });

    return { edges: [baseEdge, ...userToResourceNodes], events };
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
    isNodeOfEntity(sourceNode, IAMNodeEntity.Role) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.User)
  ) {
    return connectionStrategies.roleToUser(context, sourceNode, targetNode);
  }

  throw new Error('Unsupported connection type');
}
