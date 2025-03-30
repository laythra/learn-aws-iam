import { DeepPartial } from '@chakra-ui/react';
import { produce } from 'immer';
import _ from 'lodash';
import { Edge, Node } from 'reactflow';

import { deleteConnectionEdges } from './edges-deletion-state-machine-actions';
import {
  BaseFinishEventMap,
  EdgeConnectionObjective,
  GenericContext,
  NodeConnection,
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
  PartialEdge,
  PolicyGrantedAccess,
} from '@/types';
import { getEdgeName, getEdgeLabel } from '@/utils/names';
import { isNodeOfAnyEntity, isNodeOfEntity } from '@/utils/node-type-guards';

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
  targetNode: Node<IAMAnyNodeData>,
  options?: PartialEdge
): { edge: Edge; events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] } {
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] = [];
  const insideTutorial = context.in_tutorial_state;
  const edgeLabel = getEdgeLabel(sourceNode.data.entity, targetNode.data.entity);
  let validEdge: Edge<IAMEdgeData> | undefined = undefined;

  const invalidEdge = createEdge(
    _.merge(
      {
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
      },
      options
    )
  );

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

function updateNodeConnectionsMap<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  newEdge: Edge<IAMEdgeData>,
  newEdges: Edge<IAMEdgeData>[]
): NodeConnection[] {
  return produce(context.nodes_connnections, draftConnections => {
    const nodesById = _.keyBy(context.nodes, 'id');
    const sourceNode = nodesById[newEdge.source];
    const targetNode = nodesById[newEdge.target];

    draftConnections.push({ from: sourceNode, to: targetNode });
    newEdges.forEach(edge => {
      draftConnections.push({
        from: nodesById[edge.source],
        to: nodesById[edge.target],
        parent_edge_id: newEdge.id,
      });
    });
  });
}

function applyStrategy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  source: Node<IAMAnyNodeData>,
  target: Node<IAMAnyNodeData>,
  isInitialEdge: boolean,
  options: Partial<Edge>,
  computeExtraEdges: (baseEdgeId: string) => Edge<IAMEdgeData>[]
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][];
} {
  let baseEdge: Edge<IAMEdgeData>;
  let events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][];

  if (isInitialEdge) {
    baseEdge = createEdge({
      source: source.id,
      target: target.id,
      animated: true,
      deletable: false,
      data: {
        hovering_label: getEdgeLabel(source.data.entity, target.data.entity),
        hovering_color: theme.colors.blue[500],
        color: theme.colors.black,
        label_always_visible: false,
      },
      ...options,
    });

    events = [];
  } else {
    ({ edge: baseEdge, events } = createEdgeWithEvents(context, source, target, options));
  }

  const extraEdges = computeExtraEdges(baseEdge.id);

  const updatedContext = produce(context, draft => {
    draft.edges.push(baseEdge, ...extraEdges);
    draft.nodes_connnections = updateNodeConnectionsMap(context, baseEdge, extraEdges);
  });

  return { updatedContext, events };
}

function filterConnections<T extends IAMNodeEntity>(
  nodeConnections: NodeConnection[],
  targetId: string,
  entity: T
): Array<NodeConnection & { from: Node<Extract<IAMAnyNodeData, { entity: T }>> }> {
  return nodeConnections.filter(
    (
      connection
    ): connection is NodeConnection & { from: Node<Extract<IAMAnyNodeData, { entity: T }>> } =>
      connection.to.id === targetId && isNodeOfAnyEntity(connection.from, [entity])
  );
}

const connectionStrategies = {
  policyToUser: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMPolicyNodeData>,
    userNode: Node<IAMUserNodeData>,
    isInitialEdge: boolean,
    options: PartialEdge
  ) =>
    applyStrategy(context, policyNode, userNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(userNode.id, policyNode.data.granted_accesses, baseEdgeId)
    ),

  policyToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMPolicyNodeData>,
    groupNode: Node<IAMGroupNodeData>,
    isInitialEdge: boolean,
    options: Partial<Edge>
  ) => {
    const userConnections = filterConnections(
      context.nodes_connnections,
      groupNode.id,
      IAMNodeEntity.User
    );
    return applyStrategy(context, policyNode, groupNode, isInitialEdge, options, baseEdgeId =>
      userConnections.flatMap(connection =>
        createEdgesFromGrantedAccesses(
          connection.from.id,
          policyNode.data.granted_accesses,
          baseEdgeId
        )
      )
    );
  },

  policyToRole: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMPolicyNodeData>,
    roleNode: Node<IAMRoleNodeData>,
    isInitialEdge: boolean,
    options: Partial<Edge> = {}
  ) => {
    const userConnections = filterConnections(
      context.nodes_connnections,
      roleNode.id,
      IAMNodeEntity.User
    );
    const resourceConnections = filterConnections(
      context.nodes_connnections,
      roleNode.id,
      IAMNodeEntity.Resource
    );
    return applyStrategy(context, policyNode, roleNode, isInitialEdge, options, baseEdgeId => {
      const userEdges = userConnections.flatMap(connection =>
        createEdgesFromGrantedAccesses(
          connection.from.id,
          policyNode.data.granted_accesses,
          baseEdgeId
        )
      );
      const resourceEdges = resourceConnections.flatMap(connection =>
        createEdgesFromGrantedAccesses(
          connection.from.id,
          policyNode.data.granted_accesses,
          baseEdgeId
        )
      );
      return [...userEdges, ...resourceEdges];
    });
  },

  userToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: Node<IAMUserNodeData>,
    groupNode: Node<IAMGroupNodeData>,
    isInitialEdge: boolean,
    options: Partial<Edge> = {}
  ) => {
    const policyConnections = filterConnections(
      context.nodes_connnections,
      groupNode.id,
      IAMNodeEntity.Policy
    );
    return applyStrategy(context, userNode, groupNode, isInitialEdge, options, baseEdgeId =>
      policyConnections.flatMap(connection =>
        createEdgesFromGrantedAccesses(
          userNode.id,
          connection.from.data.granted_accesses,
          baseEdgeId
        )
      )
    );
  },

  userToRole: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: Node<IAMUserNodeData>,
    roleNode: Node<IAMRoleNodeData>,
    isInitialEdge: boolean,
    options: Partial<Edge> = {}
  ) => {
    const policyConnections = filterConnections(
      context.nodes_connnections,
      roleNode.id,
      IAMNodeEntity.Policy
    );
    return applyStrategy(context, userNode, roleNode, isInitialEdge, options, baseEdgeId =>
      policyConnections.flatMap(connection =>
        createEdgesFromGrantedAccesses(
          userNode.id,
          connection.from.data.granted_accesses,
          baseEdgeId
        )
      )
    );
  },

  roleToResource: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    roleNode: Node<IAMRoleNodeData>,
    resourceNode: Node<IAMResourceNodeData>,
    isInitialEdge: boolean,
    options: Partial<Edge> = {}
  ) => {
    const policyConnections = filterConnections(
      context.nodes_connnections,
      roleNode.id,
      IAMNodeEntity.Policy
    );
    return applyStrategy(context, roleNode, resourceNode, isInitialEdge, options, baseEdgeId =>
      policyConnections.flatMap(connection =>
        createEdgesFromGrantedAccesses(
          resourceNode.id,
          connection.from.data.granted_accesses,
          baseEdgeId
        )
      )
    );
  },
  anyToAny: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMAnyNodeData>,
    resourceNode: Node<IAMAnyNodeData>,
    isInitialEdge: boolean,
    options: Partial<Edge> = {}
  ) => {
    return applyStrategy(
      context,
      policyNode,
      resourceNode,
      isInitialEdge,
      options,
      _baseEdge => []
    );
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
  targetNode: Node<IAMAnyNodeData>,
  isInitialEdge: boolean = false,
  options: PartialEdge = {}
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][];
} {
  if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.User)
  ) {
    return connectionStrategies.policyToUser(
      context,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Group)
  ) {
    return connectionStrategies.policyToGroup(
      context,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Role)
  ) {
    return connectionStrategies.policyToRole(
      context,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.User) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Group)
  ) {
    return connectionStrategies.userToGroup(
      context,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.User) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Role)
  ) {
    return connectionStrategies.userToRole(context, sourceNode, targetNode, isInitialEdge, options);
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Role) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Resource)
  ) {
    return connectionStrategies.roleToResource(
      context,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  }

  return connectionStrategies.anyToAny(context, sourceNode, targetNode, isInitialEdge, options);
}

export function refreshPolicyConnections<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  policyNode: Node<IAMPolicyNodeData>
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
} {
  const nodeById = _.keyBy(context.nodes, 'id');
  const edgesToDelete = context.edges.filter(edge => {
    edge.source == policyNode.id;
  });

  let { updatedContext } = deleteConnectionEdges(
    context,
    edgesToDelete.map(edge => edge.id)
  );

  edgesToDelete.forEach(edge => {
    ({ updatedContext } = updateConnectionEdges(updatedContext, policyNode, nodeById[edge.target]));
  });

  return { updatedContext };
}
