import { Edge } from '@xyflow/react';
import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { BaseFinishEventMap, GenericContext } from '../types';
import { createAggregatedUsersNode } from '@/factories/nodes/aggregate-user-nodes-factory';
import { IAMAggregatedUsersNode, IAMAnyNode, IAMNodeEntity, IAMUserNode } from '@/types';

function outboundTargetsForUser(userId: string, edges: Edge[]): string {
  return edges
    .filter(edge => edge.source === userId)
    .map(edge => edge.target)
    .join('-');
}

function aggregationKeyForUser(user: IAMUserNode, edges: Edge[]): string {
  const outboundTargets = outboundTargetsForUser(user.id, edges);

  return user.parentId
    ? `child-${user.parentId}-${user.data.layout_group_id}-${outboundTargets}`
    : `${user.data.layout_group_id}-${outboundTargets}`;
}

function captureOriginalEdgeSources(
  edges: WritableDraft<Edge>[],
  sourceNodeIds: string[]
): Record<string, string> {
  return edges.reduce<Record<string, string>>((acc, edge) => {
    if (sourceNodeIds.includes(edge.source)) {
      acc[edge.id] = edge.source;
    }
    return acc;
  }, {});
}

function rewireEdgesToAggregatedNode(
  edges: WritableDraft<Edge>[],
  sourceNodeIds: string[],
  aggregatedNodeId: string
): void {
  edges.forEach(edge => {
    if (sourceNodeIds.includes(edge.source)) {
      edge.source = aggregatedNodeId;
    }
  });
}

function setUsersAggregatedState(
  nodes: WritableDraft<IAMAnyNode>[],
  userIds: string[],
  aggregated: boolean
): void {
  nodes.forEach(node => {
    if (userIds.includes(node.id)) {
      node.hidden = aggregated;
      node.data.aggregated = aggregated;
    }
  });
}

function restoreEdgeSources(
  edges: WritableDraft<Edge>[],
  originalMappings: Record<string, string>
): void {
  edges.forEach(edge => {
    const originalSourceId = originalMappings[edge.id];
    if (originalSourceId) {
      edge.source = originalSourceId;
    }
  });
}

export function aggregateUserNodes<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>
): GenericContext<TLevelObjectiveID, TFinishEventMap> {
  return produce(context, draft => {
    const userNodes = draft.nodes.filter(
      node => node.data.entity === IAMNodeEntity.User
    ) as WritableDraft<IAMUserNode>[];

    const groupedUsers = _.groupBy(userNodes, user => aggregationKeyForUser(user, context.edges));

    Object.values(groupedUsers).forEach(group => {
      if (group.length < 2) return;

      const userIds = group.map(u => u.id);
      const originalEdgeMappings = captureOriginalEdgeSources(draft.edges, userIds);

      const aggregatedNode = createAggregatedUsersNode({
        dataOverrides: {
          id: `aggregated-user-node-${userIds.join('-')}`,
          layout_group_id: group[0].data.layout_group_id,
          parent_id: group[0].parentId,
          aggregated_user_ids: userIds,
          original_edge_mappings: originalEdgeMappings,
        },
        rootOverrides: {
          parentId: group[0].parentId,
        },
      }) as WritableDraft<IAMAggregatedUsersNode>;

      draft.nodes.push(aggregatedNode);

      setUsersAggregatedState(draft.nodes, userIds, true);
      rewireEdgesToAggregatedNode(draft.edges, userIds, aggregatedNode.id);
    });
  });
}

export function deaggregateUserNodes<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeId: string
): GenericContext<TLevelObjectiveID, TFinishEventMap> {
  return produce(context, draft => {
    const aggregatedNode = draft.nodes.find(
      (node): node is WritableDraft<IAMAggregatedUsersNode> =>
        node.id === nodeId && node.data.entity === IAMNodeEntity.AggregatedUsers
    );

    if (!aggregatedNode) return;

    draft.nodes = draft.nodes.filter(n => n.id !== aggregatedNode.id);

    setUsersAggregatedState(draft.nodes, aggregatedNode.data.aggregated_user_ids, false);

    restoreEdgeSources(draft.edges, aggregatedNode.data.original_edge_mappings);
  });
}
