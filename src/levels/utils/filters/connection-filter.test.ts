import { describe, it, expect, beforeEach } from 'vitest';

import { ConnectionFilter } from './connection-filter';
import { createEdge } from '@/domain/edge-factory';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { createPermissionBoundaryNode } from '@/domain/nodes/permission-boundary-node-factory';
import { createRoleNode } from '@/domain/nodes/role-node-factory';
import { createSCPNode } from '@/domain/nodes/scp-node-factory';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMEdge } from '@/types/iam-node-types';

const user1 = createUserNode({
  rootOverrides: { id: 'user-1' },
  dataOverrides: { id: 'user-1', tags: [['Env', 'prod']] },
});
const user2 = createUserNode({
  rootOverrides: { id: 'user-2' },
  dataOverrides: { id: 'user-2', tags: [['Env', 'staging']] },
});
const policy1 = createIdentityPolicyNode({
  rootOverrides: { id: 'policy-1' },
  dataOverrides: { id: 'policy-1', tags: [] },
});
const policy2 = createIdentityPolicyNode({
  rootOverrides: { id: 'policy-2' },
  dataOverrides: { id: 'policy-2', tags: [['Owner', 'ops']] },
});
const role1 = createRoleNode({
  rootOverrides: { id: 'role-1' },
  dataOverrides: { id: 'role-1', tags: [] },
});
const pb1 = createPermissionBoundaryNode({
  rootOverrides: { id: 'pb-1' },
  dataOverrides: { id: 'pb-1', tags: [] },
});
const scp1 = createSCPNode({
  rootOverrides: { id: 'scp-1' },
  dataOverrides: { id: 'scp-1', tags: [] },
});

const makeEdge = (
  source: Parameters<typeof createEdge>[0]['rootOverrides']['source'],
  target: Parameters<typeof createEdge>[0]['rootOverrides']['target'],
  sourceNode: IAMEdge['data']['source_node'],
  targetNode: IAMEdge['data']['target_node']
): IAMEdge =>
  createEdge({
    rootOverrides: { source, target },
    dataOverrides: { source_node: sourceNode, target_node: targetNode },
  });

describe('ConnectionFilter', () => {
  let edges: IAMEdge[];

  beforeEach(() => {
    edges = [
      makeEdge('user-1', 'policy-1', user1, policy1),
      makeEdge('user-1', 'policy-2', user1, policy2),
      makeEdge('user-2', 'policy-1', user2, policy1),
      makeEdge('role-1', 'policy-1', role1, policy1),
      makeEdge('pb-1', 'user-1', pb1, user1),
      makeEdge('scp-1', 'role-1', scp1, role1),
    ];
  });

  describe('fromEdges / build', () => {
    it('returns all edges when no filters applied', () => {
      const result = ConnectionFilter.create().fromEdges(edges).build();
      expect(result).toHaveLength(6);
    });

    it('returns empty array for empty input', () => {
      const result = ConnectionFilter.create().fromEdges([]).build();
      expect(result).toHaveLength(0);
    });
  });

  describe('whereSourceIs', () => {
    it('filters edges by exact source id', () => {
      const result = ConnectionFilter.create().fromEdges(edges).whereSourceIs('user-1').build();
      expect(result).toHaveLength(2);
      expect(result.every(e => e.source === 'user-1')).toBe(true);
    });

    it('returns empty when source not found', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceIs('nonexistent')
        .build();
      expect(result).toHaveLength(0);
    });
  });

  describe('whereTargetIs', () => {
    it('filters edges by exact target id', () => {
      const result = ConnectionFilter.create().fromEdges(edges).whereTargetIs('policy-1').build();
      expect(result).toHaveLength(3);
      expect(result.every(e => e.data!.target_node.id === 'policy-1')).toBe(true);
    });
  });

  describe('whereTargetIn', () => {
    it('filters edges whose target is in a list', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereTargetIn(['policy-1', 'policy-2'])
        .build();
      expect(result).toHaveLength(4);
    });

    it('returns empty when no target matches', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereTargetIn(['nonexistent'])
        .build();
      expect(result).toHaveLength(0);
    });
  });

  describe('whereTargetNotIn', () => {
    it('excludes edges whose target is in the list', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereTargetNotIn(['policy-1', 'policy-2'])
        .build();
      expect(result).toHaveLength(2);
      expect(result.every(e => !['policy-1', 'policy-2'].includes(e.data!.target_node.id))).toBe(
        true
      );
    });
  });

  describe('whereSourceEntityIs', () => {
    it('filters by source entity type', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceEntityIs(IAMNodeEntity.User)
        .build();
      expect(result).toHaveLength(3);
      expect(result.every(e => e.data!.source_node.data.entity === IAMNodeEntity.User)).toBe(true);
    });

    it('filters permission boundary source edges', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceEntityIs(IAMNodeEntity.PermissionBoundary)
        .build();
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('pb-1');
    });
  });

  describe('whereSourceEntityIn', () => {
    it('filters edges where source entity is one of several', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceEntityIn([IAMNodeEntity.User, IAMNodeEntity.Role])
        .build();
      expect(result).toHaveLength(4);
    });
  });

  describe('whereTargetEntityIs', () => {
    it('filters by target entity type', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereTargetEntityIs(IAMNodeEntity.IdentityPolicy)
        .build();
      expect(result).toHaveLength(4);
      expect(
        result.every(e => e.data!.target_node.data.entity === IAMNodeEntity.IdentityPolicy)
      ).toBe(true);
    });
  });

  describe('whereTargetEntityIn', () => {
    it('filters edges where target entity is one of several', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereTargetEntityIn([IAMNodeEntity.User, IAMNodeEntity.Role])
        .build();
      expect(result).toHaveLength(2);
    });
  });

  describe('whereTargetEntityNotIn', () => {
    it('excludes edges whose target entity is in the list', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereTargetEntityNotIn([IAMNodeEntity.IdentityPolicy])
        .build();
      expect(result).toHaveLength(2);
    });
  });

  describe('whereEntityIs', () => {
    it('filters by source side', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereEntityIs(IAMNodeEntity.SCP, 'source')
        .build();
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('scp-1');
    });

    it('filters by target side', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereEntityIs(IAMNodeEntity.User, 'target')
        .build();
      expect(result).toHaveLength(1);
      expect(result[0].data!.target_node.id).toBe('user-1');
    });

    it('filters by either side', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereEntityIs(IAMNodeEntity.Role, 'either')
        .build();
      expect(result).toHaveLength(2);
    });
  });

  describe('whereSourceHasTag / whereTargetHasTag', () => {
    it('filters by source tag key only', () => {
      const result = ConnectionFilter.create().fromEdges(edges).whereSourceHasTag('Env').build();
      expect(result).toHaveLength(3);
    });

    it('filters by source tag key and value', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceHasTag('Env', 'prod')
        .build();
      expect(result).toHaveLength(2);
      expect(result.every(e => e.source === 'user-1')).toBe(true);
    });

    it('filters by target tag key only', () => {
      const result = ConnectionFilter.create().fromEdges(edges).whereTargetHasTag('Owner').build();
      expect(result).toHaveLength(1);
      expect(result[0].data!.target_node.id).toBe('policy-2');
    });

    it('returns empty when tag not found', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceHasTag('NonExistent')
        .build();
      expect(result).toHaveLength(0);
    });
  });

  describe('chained filters (AND behaviour)', () => {
    it('combines source entity and target id filters', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceEntityIs(IAMNodeEntity.User)
        .whereTargetIs('policy-2')
        .build();
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('user-1');
    });

    it('returns empty when chained filters produce no match', () => {
      const result = ConnectionFilter.create()
        .fromEdges(edges)
        .whereSourceEntityIs(IAMNodeEntity.Role)
        .whereTargetIs('policy-2')
        .build();
      expect(result).toHaveLength(0);
    });
  });

  describe('mapTo / mapToEdgeIds', () => {
    it('mapToEdgeIds returns ids of matching edges', () => {
      const ids = ConnectionFilter.create().fromEdges(edges).whereSourceIs('user-1').mapToEdgeIds();
      expect(ids).toHaveLength(2);
      expect(ids.every(id => typeof id === 'string')).toBe(true);
    });

    it('mapTo applies a custom mapper', () => {
      const sources = ConnectionFilter.create()
        .fromEdges(edges)
        .whereTargetIs('policy-1')
        .mapTo(e => e.source);
      expect(sources).toEqual(expect.arrayContaining(['user-1', 'user-2', 'role-1']));
    });
  });
});
