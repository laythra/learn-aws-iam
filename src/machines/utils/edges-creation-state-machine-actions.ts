import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { ConnectionFilter } from './connection-filter';
import { deleteConnectionEdges } from './edges-deletion-state-machine-actions';
import { selectGuardRailsNodes } from './node-selectors';
import {
  BaseFinishEventMap,
  EdgeConnectionObjective,
  GenericContext,
  ObjectiveType,
} from '../types';
import { createEdge } from '@/factories/edge-factory';
import { theme } from '@/theme';
import { IAMNodeEntity, PartialEdge, PolicyGrantedAccess } from '@/types';
import {
  IAMAccountNode,
  IAMAnyNode,
  IAMEdge,
  IAMGroupNode,
  IAMGuardRailsNode,
  IAMOUNode,
  IAMPolicyNode,
  IAMResourceNode,
  IAMRoleNode,
  IAMSCPNode,
  IAMUserNode,
} from '@/types/iam-node-types';
import { getEdgeName, getEdgeLabel } from '@/utils/names';
import { isNodeOfEntity } from '@/utils/node-type-guards';

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

function markBlockedEdges(edges: IAMEdge[], guardRailsNodes: IAMGuardRailsNode[]): IAMEdge[] {
  if (edges.length == 0) return edges;

  return produce(edges, draftEdges => {
    draftEdges.forEach(edge => {
      if (!edge.data) return;

      const isBlocked = guardRailsNodes.some(
        guardRailsNode => guardRailsNode.data.is_edge_blocked?.(edge)
      );

      if (!isBlocked) {
        edge.data.is_blocked = false;
      } else {
        edge.data.is_blocked = true;
        edge.data.hovering_label = 'Access blocked by Permission Boundary 🔒';
        edge.data.persistent_label = '🔒';
        edge.data.color = theme.colors.red[500];
        edge.data.hovering_color = theme.colors.red[500];
      }
    });
  });
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

  // Create an invalid edge that will be used if no valid edge is found
  // This edge will be deletable
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
      persistent_label: edgeLabel,
      hovering_color: theme.colors.red[500],
      color: theme.colors.yellow[500],
      unnecessary_edge: true,
      target_node: targetNode,
      source_node: sourceNode,
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
  allNodes: IAMAnyNode[],
  candidateNodes: IAMAnyNode[],
  grantedAccesses: PolicyGrantedAccess[],
  parentEdgeId: string
): IAMEdge[] {
  const nodesById = _.keyBy(allNodes, 'id');
  return grantedAccesses.flatMap(access => {
    const applicableNodes = access.applicable_nodes?.(candidateNodes) ?? candidateNodes;
    return applicableNodes.map(node =>
      createEdge({
        rootOverrides: {
          source: node.id,
          target: access.target_node,
          targetHandle: access.target_handle,
          sourceHandle: access.source_handle,
          deletable: false,
        },
        dataOverrides: {
          hovering_label: access.access_level,
          parent_edge_id: parentEdgeId,
          source_node: node,
          target_node: nodesById[access.target_node],
        },
      })
    );
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
        persistent_label: undefined,
        color: theme.colors.black,
        source_node: source,
        target_node: target,
      },
    });

    events = [];
  } else {
    ({ edge: baseEdge, events } = createEdgeWithEvents(context, source, target, options));
  }

  // TODO: Should we compute extra edges only if the established edge wasn't an initial edge?
  const extraEdges = computeExtraEdges(baseEdge.id) as WritableDraft<IAMEdge>[];

  const updatedContext = produce(context, draft => {
    const guardRailsNodes = selectGuardRailsNodes(draft.nodes);
    const updatedEdges = markBlockedEdges(
      [...extraEdges, ...context.edges, baseEdge],
      guardRailsNodes
    ) as WritableDraft<IAMEdge>[];

    draft.edges = updatedEdges;
  });

  return { updatedContext, events };
}

const connectionStrategies = {
  policyToUser: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: IAMPolicyNode,
    userNode: IAMUserNode,
    isInitialEdge: boolean,
    options: PartialEdge
  ) => {
    return applyStrategy(context, policyNode, userNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        context.nodes,
        [userNode],
        policyNode.data.granted_accesses,
        baseEdgeId
      )
    );
  },
  policyToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: IAMPolicyNode,
    groupNode: IAMGroupNode,
    isInitialEdge: boolean,
    options: PartialEdge
  ) => {
    const usersConnectedToGroup = ConnectionFilter.create()
      .fromEdges(context.edges)
      .whereTargetIs(groupNode.id)
      .whereSourceEntityIs(IAMNodeEntity.User)
      .build()
      .map(edge => edge.data!.source_node as IAMUserNode);

    return applyStrategy(context, policyNode, groupNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        context.nodes,
        usersConnectedToGroup,
        policyNode.data.granted_accesses,
        baseEdgeId
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
    const usersConnectedToRole = ConnectionFilter.create()
      .fromEdges(context.edges)
      .whereSourceEntityIs(IAMNodeEntity.User)
      .whereTargetIs(roleNode.id)
      .build()
      .map(edge => edge.data!.source_node);

    const resourcesConnectedToRole = ConnectionFilter.create()
      .fromEdges(context.edges)
      .whereSourceEntityIs(IAMNodeEntity.Resource)
      .whereTargetIs(roleNode.id)
      .build()
      .map(edge => edge.data!.source_node);

    return applyStrategy(context, policyNode, roleNode, isInitialEdge, options, baseEdgeId => {
      return createEdgesFromGrantedAccesses(
        context.nodes,
        usersConnectedToRole.concat(resourcesConnectedToRole),
        policyNode.data.granted_accesses,
        baseEdgeId
      );
    });
  },

  userToGroup: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: IAMUserNode,
    groupNode: IAMGroupNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
  ) => {
    const policiesConnectedToGroup = ConnectionFilter.create()
      .fromEdges(context.edges)
      .whereTargetIs(groupNode.id)
      .whereSourceEntityIs(IAMNodeEntity.Policy)
      .build()
      .flatMap(edge => edge.data!.source_node as IAMPolicyNode);

    return applyStrategy(context, userNode, groupNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        context.nodes,
        [userNode],
        policiesConnectedToGroup.flatMap(policy => policy.data.granted_accesses),
        baseEdgeId
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
    const policiesConnectedToRole = ConnectionFilter.create()
      .fromEdges(context.edges)
      .whereSourceEntityIs(IAMNodeEntity.Policy)
      .whereTargetIs(roleNode.id)
      .build()
      .map(edge => edge.data!.source_node as IAMPolicyNode);

    return applyStrategy(context, userNode, roleNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        context.nodes,
        [userNode],
        policiesConnectedToRole.flatMap(policy => policy.data.granted_accesses),
        baseEdgeId
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
    const policiesConnectedToRole = ConnectionFilter.create()
      .fromEdges(context.edges)
      .whereTargetIs(roleNode.id)
      .whereSourceEntityIs(IAMNodeEntity.Policy)
      .build()
      .map(edge => edge.data!.source_node as IAMPolicyNode);

    return applyStrategy(context, roleNode, resourceNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        context.nodes,
        [resourceNode],
        policiesConnectedToRole.flatMap(policy => policy.data.granted_accesses),
        baseEdgeId
      )
    );
  },
  SCPToOU: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    SCPNode: IAMSCPNode,
    OUNode: IAMOUNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
  ) => {
    return applyStrategy(context, SCPNode, OUNode, isInitialEdge, options, () => []);
  },
  SCPToAccount: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    SCPNode: IAMSCPNode,
    AccountNode: IAMAccountNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
  ) => {
    return applyStrategy(context, SCPNode, AccountNode, isInitialEdge, options, () => []);
  },
  // PolicyToResource: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  //   context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  //   policyNode: IAMPolicyNode,
  //   resourceNode: IAMResourceNode,
  //   isInitialEdge: boolean,
  //   options: PartialEdge = {}
  // ) =>
  //   applyStrategy(context, policyNode, resourceNode, isInitialEdge, options, baseEdgeId =>
  //     createEdgesFromGrantedAccesses(policyNode.id, policyNode.data.granted_accesses, baseEdgeId)
  //   ),
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
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.SCP) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.OU)
  ) {
    const updatedContext = produce(context, draftContext => {
      draftContext.edges = markBlockedEdges(draftContext.edges, [
        sourceNode,
      ]) as WritableDraft<IAMEdge>[];
    });

    return connectionStrategies.SCPToOU(
      updatedContext,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.SCP) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Account)
  ) {
    return connectionStrategies.SCPToAccount(
      context,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Resource)
  ) {
    // return connectionStrategies.PolicyToResource(
    //   context,
    //   sourceNode,
    //   targetNode,
    //   isInitialEdge,
    //   options
    // );
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
  const edgeById = _.keyBy(context.edges, 'id');

  const edgesToDelete = ConnectionFilter.create()
    .fromEdges(context.edges)
    .whereSourceIs(policyNode.id)
    .mapToEdgeIds();

  let { updatedContext } = deleteConnectionEdges(context, edgesToDelete);

  edgesToDelete.forEach(edgeId => {
    const edge = edgeById[edgeId];

    ({ updatedContext } = updateConnectionEdges(
      updatedContext,
      policyNode,
      nodeById[edge.target],
      true
    ));
  });

  return { updatedContext };
}
