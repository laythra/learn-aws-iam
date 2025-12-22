import { describe, it, expect } from 'vitest';

import {
  aggregateUserNodes,
  deaggregateUserNodes,
} from './user-node-aggregation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createAggregatedUsersNode } from '@/factories/nodes/aggregate-user-nodes-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { IAMNodeEntity, IAMUserNode, IAMAggregatedUsersNode, IAMEdge, IAMAnyNode } from '@/types';

const createTestContext = (
  nodes: IAMAnyNode[],
  edges: IAMEdge[] = []
): ReturnType<typeof createMockContext> => {
  return createMockContext({ nodes, edges });
};

describe('user-node-aggregation-state-machine-actions', () => {
  describe('aggregateUserNodes', () => {
    it('should not aggregate when there is only one user in a group', () => {
      const context = createTestContext([
        createUserNode({ dataOverrides: { layout_group_id: 'group1' } }),
      ]);

      const result = aggregateUserNodes(context);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data.entity).toBe(IAMNodeEntity.User);
    });

    it('should aggregate users with same layout_group_id and outbound targets', () => {
      const context = createTestContext(
        [
          createUserNode({
            rootOverrides: { id: 'user1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user2' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
        ],
        [
          { id: 'e1', source: 'user1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'user2', target: 'target1', data: {} } as IAMEdge,
        ]
      );

      const result = aggregateUserNodes(context);

      const aggregatedNode = result.nodes.find(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      ) as IAMAggregatedUsersNode;
      expect(aggregatedNode).toBeDefined();
      expect(aggregatedNode.data.aggregated_user_ids).toEqual(['user1', 'user2']);

      const user1 = result.nodes.find(n => n.id === 'user1') as IAMUserNode;
      const user2 = result.nodes.find(n => n.id === 'user2') as IAMUserNode;
      expect(user1.hidden).toBe(true);
      expect(user1.data.aggregated).toBe(true);
      expect(user2.hidden).toBe(true);
      expect(user2.data.aggregated).toBe(true);
    });

    it('should rewire edges to aggregated node', () => {
      const context = createTestContext(
        [
          createUserNode({
            rootOverrides: { id: 'user1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user2' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
        ],
        [
          { id: 'e1', source: 'user1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'user2', target: 'target1', data: {} } as IAMEdge,
        ]
      );

      const result = aggregateUserNodes(context);

      const aggregatedNode = result.nodes.find(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      ) as IAMAggregatedUsersNode;
      expect(result.edges[0].source).toBe(aggregatedNode.id);
      expect(result.edges[1].source).toBe(aggregatedNode.id);
    });

    it('should store original edge mappings', () => {
      const context = createTestContext(
        [
          createUserNode({
            rootOverrides: { id: 'user1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user2' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
        ],
        [
          { id: 'e1', source: 'user1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'user2', target: 'target1', data: {} } as IAMEdge,
        ]
      );

      const result = aggregateUserNodes(context);

      const aggregatedNode = result.nodes.find(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      ) as IAMAggregatedUsersNode;
      expect(aggregatedNode.data.original_edge_mappings).toEqual({
        e1: 'user1',
        e2: 'user2',
      });
    });

    it('should handle users with different parentIds separately', () => {
      const context = createTestContext([
        createUserNode({
          rootOverrides: { id: 'user1', parentId: 'parent1' },
          dataOverrides: { layout_group_id: 'group1' },
        }),
        createUserNode({
          rootOverrides: { id: 'user2', parentId: 'parent2' },
          dataOverrides: { layout_group_id: 'group1' },
        }),
      ]);

      const result = aggregateUserNodes(context);

      const aggregatedNodes = result.nodes.filter(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      );
      expect(aggregatedNodes).toHaveLength(0);
    });

    it('should not aggregate users with different layout_group_ids', () => {
      const context = createTestContext(
        [
          createUserNode({
            rootOverrides: { id: 'user1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user2' },
            dataOverrides: { layout_group_id: 'group2' },
          }),
        ],
        [
          { id: 'e1', source: 'user1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'user2', target: 'target1', data: {} } as IAMEdge,
        ]
      );

      const result = aggregateUserNodes(context);

      const aggregatedNodes = result.nodes.filter(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      );
      expect(aggregatedNodes).toHaveLength(0);
      expect(result.nodes).toHaveLength(2);
    });

    it('should not aggregate users with different outbound targets', () => {
      const context = createTestContext(
        [
          createUserNode({
            rootOverrides: { id: 'user1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user2' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
        ],
        [
          { id: 'e1', source: 'user1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'user2', target: 'target2', data: {} } as IAMEdge,
        ]
      );

      const result = aggregateUserNodes(context);

      const aggregatedNodes = result.nodes.filter(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      );
      expect(aggregatedNodes).toHaveLength(0);
    });

    it('should aggregate users with same parentId correctly', () => {
      const context = createTestContext(
        [
          createUserNode({
            rootOverrides: { id: 'user1', parentId: 'parent1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user2', parentId: 'parent1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
        ],
        [
          { id: 'e1', source: 'user1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'user2', target: 'target1', data: {} } as IAMEdge,
        ]
      );

      const result = aggregateUserNodes(context);

      const aggregatedNode = result.nodes.find(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      ) as IAMAggregatedUsersNode;

      expect(aggregatedNode).toBeDefined();
      expect(aggregatedNode.parentId).toBe('parent1');
      expect(aggregatedNode.data.parent_id).toBe('parent1');
    });

    it('should handle multiple groups of users to aggregate', () => {
      const context = createTestContext(
        [
          createUserNode({
            rootOverrides: { id: 'user1' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user2' },
            dataOverrides: { layout_group_id: 'group1' },
          }),
          createUserNode({
            rootOverrides: { id: 'user3' },
            dataOverrides: { layout_group_id: 'group2' },
          }),
          createUserNode({
            rootOverrides: { id: 'user4' },
            dataOverrides: { layout_group_id: 'group2' },
          }),
        ],
        [
          { id: 'e1', source: 'user1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'user2', target: 'target1', data: {} } as IAMEdge,
          { id: 'e3', source: 'user3', target: 'target2', data: {} } as IAMEdge,
          { id: 'e4', source: 'user4', target: 'target2', data: {} } as IAMEdge,
        ]
      );

      const result = aggregateUserNodes(context);

      const aggregatedNodes = result.nodes.filter(
        n => n.data.entity === IAMNodeEntity.AggregatedUsers
      ) as IAMAggregatedUsersNode[];

      expect(aggregatedNodes).toHaveLength(2);
      expect(aggregatedNodes[0].data.aggregated_user_ids).toEqual(['user1', 'user2']);
      expect(aggregatedNodes[1].data.aggregated_user_ids).toEqual(['user3', 'user4']);
    });
  });

  describe('deaggregateUserNodes', () => {
    it('should remove aggregated node and restore user nodes', () => {
      const context = createTestContext([
        createAggregatedUsersNode({
          dataOverrides: {
            id: 'aggregated-1',
            aggregated_user_ids: ['user1', 'user2'],
            original_edge_mappings: {},
            layout_group_id: 'group1',
          },
        }),
        createUserNode({
          rootOverrides: { id: 'user1', hidden: true },
          dataOverrides: { layout_group_id: 'group1', aggregated: true },
        }),
        createUserNode({
          rootOverrides: { id: 'user2', hidden: true },
          dataOverrides: { layout_group_id: 'group1', aggregated: true },
        }),
      ]);

      const result = deaggregateUserNodes(context, 'aggregated-1');

      expect(result.nodes.find(n => n.id === 'aggregated-1')).toBeUndefined();
      const user1 = result.nodes.find(n => n.id === 'user1') as IAMUserNode;
      const user2 = result.nodes.find(n => n.id === 'user2') as IAMUserNode;
      expect(user1.hidden).toBe(false);
      expect(user1.data.aggregated).toBe(false);
      expect(user2.hidden).toBe(false);
      expect(user2.data.aggregated).toBe(false);
    });

    it('should restore original edge sources', () => {
      const context = createTestContext(
        [
          createAggregatedUsersNode({
            dataOverrides: {
              id: 'aggregated-1',
              aggregated_user_ids: ['user1', 'user2'],
              original_edge_mappings: { e1: 'user1', e2: 'user2' },
              layout_group_id: 'group1',
            },
          }),
          createUserNode({
            rootOverrides: { id: 'user1', hidden: true },
            dataOverrides: { layout_group_id: 'group1', aggregated: true },
          }),
          createUserNode({
            rootOverrides: { id: 'user2', hidden: true },
            dataOverrides: { layout_group_id: 'group1', aggregated: true },
          }),
        ],
        [
          { id: 'e1', source: 'aggregated-1', target: 'target1', data: {} } as IAMEdge,
          { id: 'e2', source: 'aggregated-1', target: 'target1', data: {} } as IAMEdge,
        ]
      );

      const result = deaggregateUserNodes(context, 'aggregated-1');

      expect(result.edges[0].source).toBe('user1');
      expect(result.edges[1].source).toBe('user2');
    });

    it('should do nothing if node is not found', () => {
      const context = createTestContext([
        createUserNode({
          rootOverrides: { id: 'user1' },
          dataOverrides: { layout_group_id: 'group1' },
        }),
      ]);

      const result = deaggregateUserNodes(context, 'non-existent');

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe('user1');
    });

    it('should do nothing if node exists but is not an aggregated node', () => {
      const context = createTestContext([
        createUserNode({
          rootOverrides: { id: 'user1' },
          dataOverrides: { layout_group_id: 'group1' },
        }),
      ]);

      const result = deaggregateUserNodes(context, 'user1');

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe('user1');
    });
  });
});
