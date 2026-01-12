import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { ConnectionFilter } from './connection-filter';
import { IAMNodeFilter } from './iam-node-filter';
import { selectAffectingPermissionBoundaryNodes, selectAffectingSCPNodes } from './node-selectors';
import {
  GetLevelGuardRailsBlockedEdgesFns,
  GetLevelObjectivesApplicableNodesFns,
} from '../functions-registry';
import { GenericContext } from '../types/context-types';
import {
  BaseFinishEventMap,
  EdgeConnectionObjective,
  ObjectiveType,
} from '../types/objective-types';
import { createEdge } from '@/factories/edge-factory';
import { theme } from '@/theme';
import { IAMNodeEntity } from '@/types/iam-enums';
import { PartialEdge } from '@/types/iam-node-types';
import {
  IAMAccountNode,
  IAMAnyNode,
  IAMEdge,
  IAMGroupNode,
  IAMOUNode,
  IAMPolicyNode,
  IAMResourceNode,
  IAMResourcePolicyNode,
  IAMRoleNode,
  IAMSCPNode,
  IAMUserNode,
} from '@/types/iam-node-types';
import { PolicyGrantedAccess } from '@/types/iam-policy-types';
import { getEdgeName, getEdgeLabel } from '@/lib/iam/names';
import { isNodeOfEntity } from '@/lib/iam/node-type-guards';

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
          attached_as: sourceNode.data.entity,
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
 * @param candidateNodes The candidate nodes from which edges can be created
 * @param grantedAccesses The granted accesses of the policy
 * @param parentEdgeId The id of the parent edge that was responsible for the creation of these edges
 * @returns An array of edges
 */
function createEdgesFromGrantedAccesses<
  TLevelObjectiveID,
  TFinishedEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishedEventMap>,
  candidateNodes: IAMAnyNode[],
  grantedAccesses: PolicyGrantedAccess[],
  parentEdgeId: string
): IAMEdge[] {
  const allNodes = context.nodes;
  const applicableNodesFns = GetLevelObjectivesApplicableNodesFns(context.level_number);
  const nodesById = _.keyBy(allNodes, 'id');
  return grantedAccesses.flatMap(access => {
    const applicableNodes =
      access.applicable_nodes_fn_name && applicableNodesFns[access.applicable_nodes_fn_name]
        ? applicableNodesFns[access.applicable_nodes_fn_name](candidateNodes)
        : candidateNodes;

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
          attached_as: node.data.entity,
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
  newlyAddedEdges: IAMEdge[];
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
        attached_as: source.data.entity,
      },
    });

    events = [];
  } else {
    ({ edge: baseEdge, events } = createEdgeWithEvents(context, source, target, options));
  }

  const extraEdges = computeExtraEdges(baseEdge.id) as WritableDraft<IAMEdge>[];
  const updatedContext = produce(context, draft => {
    draft.edges = _.chain([...extraEdges, ...draft.edges, baseEdge])
      .sortBy(e => e.data?.unnecessary_edge)
      .uniqBy('id')
      .value() as WritableDraft<IAMEdge>[];
  });

  return {
    updatedContext,
    events,
    newlyAddedEdges: _.differenceBy([baseEdge, ...extraEdges], context.edges, 'id'),
  };
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
        context,
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
        context,
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
        context,
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
        context,
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
        context,
        [userNode],
        policiesConnectedToRole.flatMap(policy => policy.data.granted_accesses),
        baseEdgeId
      )
    );
  },

  resourceToRole: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    resourceNode: IAMResourceNode,
    roleNode: IAMRoleNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
  ) => {
    const policiesConnectedToRole = ConnectionFilter.create()
      .fromEdges(context.edges)
      .whereTargetIs(roleNode.id)
      .whereSourceEntityIs(IAMNodeEntity.Policy)
      .build()
      .map(edge => edge.data!.source_node as IAMPolicyNode);

    return applyStrategy(context, resourceNode, roleNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        context,
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
  policyToResource: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: IAMResourcePolicyNode,
    resourceNode: IAMResourceNode,
    isInitialEdge: boolean,
    options: PartialEdge = {}
  ) => {
    const userNodes = IAMNodeFilter.create()
      .fromNodes(context.nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .build();

    return applyStrategy(context, policyNode, resourceNode, isInitialEdge, options, baseEdgeId =>
      createEdgesFromGrantedAccesses(
        context,
        userNodes,
        policyNode.data.granted_accesses,
        baseEdgeId
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
  newlyAddedEdges: IAMEdge[];
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
    isNodeOfEntity(sourceNode, IAMNodeEntity.Resource) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Role)
  ) {
    return connectionStrategies.resourceToRole(
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
    return connectionStrategies.SCPToOU(context, sourceNode, targetNode, isInitialEdge, options);
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
    isNodeOfEntity(sourceNode, IAMNodeEntity.ResourcePolicy) &&
    isNodeOfEntity(targetNode, IAMNodeEntity.Resource)
  ) {
    return connectionStrategies.policyToResource(
      context,
      sourceNode,
      targetNode,
      isInitialEdge,
      options
    );
  }

  return connectionStrategies.anyToAny(context, sourceNode, targetNode, isInitialEdge, options);
}

export function applyGuardRailBlockingToEdges(
  edges: IAMEdge[],
  newlyAddedEdges: IAMEdge[],
  level_number: number
): { edgesAfterBlocking: IAMEdge[]; newlyAddedEdgesAfterBlocking: IAMEdge[] } {
  const blockedEdgesFns = GetLevelGuardRailsBlockedEdgesFns(level_number);
  const isPrincipalEntity = (e: IAMNodeEntity): boolean =>
    e == IAMNodeEntity.User || e == IAMNodeEntity.Role;
  const principals = edges
    .map(e => e.data?.target_node)
    .filter(node => node && isPrincipalEntity(node.data.entity)) as IAMAnyNode[];

  const guardRailsNodes = principals.flatMap(principal => {
    const affectingPBNodes = selectAffectingPermissionBoundaryNodes(edges, principal);
    const affectingSCPNodes = selectAffectingSCPNodes(edges, principal);
    return affectingPBNodes.concat(affectingSCPNodes);
  });

  if (guardRailsNodes.length === 0)
    return { edgesAfterBlocking: edges, newlyAddedEdgesAfterBlocking: newlyAddedEdges };

  const updatedEdges = produce(edges, draftEdges => {
    draftEdges.forEach(edge => {
      if (!edge.data) return;
      const blockingGuardRail = guardRailsNodes.find(
        guardRailsNode => blockedEdgesFns[guardRailsNode.data.is_edge_blocked_fn_name]?.(edge)
      );
      if (!blockingGuardRail) {
        edge.data.is_blocked = false;
      } else {
        edge.data.is_blocked = true;
        edge.data.hovering_label = blockingGuardRail.data.blocked_edge_content;
        edge.data.persistent_label = '🔒';
        edge.data.color = theme.colors.red[500];
        edge.data.hovering_color = theme.colors.red[500];
      }
    });
  });
  return {
    edgesAfterBlocking: updatedEdges,
    newlyAddedEdgesAfterBlocking: _.intersectionBy(updatedEdges, newlyAddedEdges, 'id'),
  };
}

/**
 * Deletes an edge from the context and all its children
 *  and updates connection objectives and node associations.
 *
 * @param context - The current generic context containing nodes, edges, and objectives.
 * @param edgeToDelete - The edge that should be deleted.
 * @returns An object with the updated edges list and any events related to connection objectives.
 */
export function deleteConnectionEdges<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  edgesToDelete: string[]
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  deletedEdges: IAMEdge[];
} {
  const deletedEdgeIds: string[] = [];
  const updatedContext = produce(context, draftContext => {
    // Using basic recursion to delete edges and their dependents
    function deleteEdge(edgeId: string): void {
      const dependents = draftContext.edges.filter(edge => edge.data!.parent_edge_id === edgeId);

      dependents.forEach(edge => deleteEdge(edge.id));
      deletedEdgeIds.push(edgeId);
    }

    edgesToDelete.forEach(deleteEdge);
    draftContext.edges = draftContext.edges.filter(edge => !deletedEdgeIds.includes(edge.id));
  });

  const deletedEdges = context.edges.filter(edge => deletedEdgeIds.includes(edge.id));

  return { updatedContext, deletedEdges };
}
