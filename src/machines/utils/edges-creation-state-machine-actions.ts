import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { deleteConnectionEdges } from './edges-deletion-state-machine-actions';
import {
  BaseFinishEventMap,
  EdgeConnectionObjective,
  GenericContext,
  NodeConnection,
  ObjectiveType,
} from '../types';
import { createEdge } from '@/factories/edge-factory';
import { theme } from '@/theme';
import { IAMNodeEntity, PartialEdge, PolicyGrantedAccess } from '@/types';
import {
  IAMAnyNode,
  IAMEdge,
  IAMGroupNode,
  IAMNodeMap,
  IAMPolicyNode,
  IAMResourceNode,
  IAMRoleNode,
  IAMUserNode,
} from '@/types/iam-node-types';
import { getEdgeName, getEdgeLabel } from '@/utils/names';
import { isNodeOfAnyEntity, isNodeOfEntity } from '@/utils/node-type-guards';

function isEdgeConnectionObjectiveFinished<TFinishEventMap extends BaseFinishEventMap>(
  objective: EdgeConnectionObjective<TFinishEventMap>,
  establishedEdges: IAMEdge[]
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
  sourceNode: IAMAnyNode,
  targetNode: IAMAnyNode,
  options?: PartialEdge
): { edge: IAMEdge; events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] } {
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][] = [];
  const edgeLabel = getEdgeLabel(sourceNode.data.entity, targetNode.data.entity);
  let validEdge: IAMEdge | undefined = undefined;

  const invalidEdge = createEdge({
    rootOverrides: {
      source: sourceNode.id,
      target: targetNode.id,
      animated: true,
      deletable: true,
      ...options,
    },
    dataOverrides: {
      hovering_label: edgeLabel,
      hovering_color: theme.colors.red[500],
      color: theme.colors.yellow[500],
      unnecessary_edge: true,
      label_always_visible: true,
      source_node: sourceNode,
      target_node: targetNode,
    },
  });

  context.edges_connection_objectives
    .filter(objective => !objective.is_finished)
    .forEach(objective => {
      if (!isEdgeConnectionValid(objective, getEdgeName(sourceNode.id, targetNode.id))) {
        return;
      }

      validEdge = createEdge({
        rootOverrides: {
          source: sourceNode.id,
          target: targetNode.id,
          targetHandle: objective.established_edge_target_handle,
          sourceHandle: objective.established_edge_source_handle,
          deletable: false,
        },
        dataOverrides: {
          hovering_label: edgeLabel,
          source_node: sourceNode,
          target_node: targetNode,
        },
      });

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
  parentEdgeId: string,
  sourceNode: IAMAnyNode,
  targetNode: IAMAnyNode
): IAMEdge[] {
  return grantedAccesses.map(access =>
    createEdge({
      rootOverrides: {
        source: sourceId,
        target: access.target_node,
        targetHandle: access.target_handle,
        sourceHandle: access.source_handle,
        deletable: false,
      },
      dataOverrides: {
        hovering_label: access.access_level,
        parent_edge_id: parentEdgeId,
        source_node: sourceNode,
        target_node: targetNode,
      },
    })
  );
}

function updateNodeConnectionsMap<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  newEdge: IAMEdge,
  newEdges: IAMEdge[]
): NodeConnection[] {
  return produce(context.nodes_connnections, draftConnections => {
    const nodesById = _.keyBy(context.nodes, 'id');
    const sourceNode = nodesById[newEdge.source] as WritableDraft<IAMAnyNode>;
    const targetNode = nodesById[newEdge.target] as WritableDraft<IAMAnyNode>;

    draftConnections.push({ from: sourceNode, to: targetNode });
    newEdges.forEach(edge => {
      draftConnections.push({
        from: nodesById[edge.source] as WritableDraft<IAMAnyNode>,
        to: nodesById[edge.target] as WritableDraft<IAMAnyNode>,
        parent_edge_id: newEdge.id,
      });
    });
  });
}

function applyStrategy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  source: IAMAnyNode,
  target: IAMAnyNode,
  isInitialEdge: boolean,
  options: PartialEdge,
  computeExtraEdges: (baseEdgeId: string) => IAMEdge[]
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][];
} {
  let baseEdge: IAMEdge;
  let events: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE][];

  if (isInitialEdge) {
    baseEdge = createEdge({
      rootOverrides: {
        source: source.id,
        target: target.id,
        animated: true,
        deletable: false,
        ...options,
      },
      dataOverrides: {
        hovering_label: getEdgeLabel(source.data.entity, target.data.entity),
        hovering_color: theme.colors.blue[500],
        color: theme.colors.black,
        label_always_visible: false,
        source_node: source,
        target_node: target,
      },
    });

    events = [];
  } else {
    ({ edge: baseEdge, events } = createEdgeWithEvents(context, source, target, options));
  }

  const extraEdges = computeExtraEdges(baseEdge.id) as WritableDraft<IAMEdge>[];

  const updatedContext = produce(context, draft => {
    draft.edges.push(baseEdge as WritableDraft<IAMEdge>, ...extraEdges);
    draft.nodes_connnections = updateNodeConnectionsMap(
      context,
      baseEdge,
      extraEdges
    ) as WritableDraft<NodeConnection[]>;
  });

  return { updatedContext, events };
}

function filterConnections<T extends IAMNodeEntity>(
  nodeConnections: NodeConnection[],
  targetId: string,
  entity: T
): Array<NodeConnection & { from: IAMNodeMap[T] }> {
  return nodeConnections.filter(
    (connection): connection is NodeConnection & { from: IAMNodeMap[T] } =>
      connection.to.id === targetId && isNodeOfAnyEntity(connection.from, [entity])
  );
}

const connectionStrategies = {
  policyToUser: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: IAMPolicyNode,
    userNode: IAMUserNode,
    isInitialEdge: boolean,
    options: PartialEdge
  ) =>
    applyStrategy(context, policyNode, userNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        userNode.id,
        policyNode.data.granted_accesses,
        baseEdgeId,
        policyNode,
        userNode
      )
    ),

  policyToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: IAMPolicyNode,
    groupNode: IAMGroupNode,
    isInitialEdge: boolean,
    options: PartialEdge
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
          baseEdgeId,
          policyNode,
          groupNode
        )
      )
    );
  },

  policyToRole: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: IAMPolicyNode,
    roleNode: IAMRoleNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
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
          baseEdgeId,
          policyNode,
          roleNode
        )
      );
      const resourceEdges = resourceConnections.flatMap(connection =>
        createEdgesFromGrantedAccesses(
          connection.from.id,
          policyNode.data.granted_accesses,
          baseEdgeId,
          policyNode,
          roleNode
        )
      );
      return [...userEdges, ...resourceEdges];
    });
  },

  userToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: IAMUserNode,
    groupNode: IAMGroupNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
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
          baseEdgeId,
          userNode,
          groupNode
        )
      )
    );
  },

  userToRole: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: IAMUserNode,
    roleNode: IAMRoleNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
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
          baseEdgeId,
          userNode,
          roleNode
        )
      )
    );
  },

  roleToResource: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    roleNode: IAMRoleNode,
    resourceNode: IAMResourceNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
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
          baseEdgeId,
          roleNode,
          resourceNode
        )
      )
    );
  },
  anyToAny: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: IAMAnyNode,
    resourceNode: IAMAnyNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
  ) => {
    return applyStrategy(context, policyNode, resourceNode, isInitialEdge, options, () => []);
  },
} as const;

// --- Generic Connection Updater ---
// Determines the connection type and applies the corresponding strategy.
export function updateConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  sourceNode: IAMAnyNode,
  targetNode: IAMAnyNode,
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
  policyNode: IAMPolicyNode
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
} {
  const nodeById = _.keyBy(context.nodes, 'id');
  const edgesToDelete = context.edges.filter(edge => {
    return edge.source == policyNode.id;
  });

  let { updatedContext } = deleteConnectionEdges(
    context,
    edgesToDelete.map(edge => edge.id)
  );

  edgesToDelete.forEach(edge => {
    ({ updatedContext } = updateConnectionEdges(
      updatedContext,
      policyNode,
      nodeById[edge.target],
      true
    ));
  });

  return { updatedContext };
}
