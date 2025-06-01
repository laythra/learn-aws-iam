import { describe, it, expect } from 'vitest';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { resolveInitialEdges } from './initial-edges-resolver';
import { NodeConnection } from '../types';
import { createMockContext } from '@/__test-helpers__/context';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { AccessLevel, IAMAnyNode, IAMEdge } from '@/types';
import { getEdgeName } from '@/utils/names';

describe('updateConnectionEdges', () => {
  const createEdgeTestContext = (
    connections: { from: string; to: string }[] = [],
    nodes: IAMAnyNode[]
  ): ReturnType<typeof createMockContext> => {
    const ctx = createMockContext({ nodes, initial_node_connections: connections });
    const { edges, nodes_connections } = resolveInitialEdges(ctx);
    return { ...ctx, edges, nodes_connnections: nodes_connections };
  };

  const expectEdges = (edges: IAMEdge[], expected: { source: string; target: string }[]): void => {
    expect(edges).toHaveLength(expected.length);
    expect(edges).toEqual(
      expect.arrayContaining(expected.map(obj => expect.objectContaining(obj)))
    );
  };

  const expectConnections = (connections: NodeConnection[], expected: NodeConnection[]): void => {
    expect(connections).toHaveLength(expected.length);
    expect(connections).toEqual(
      expect.arrayContaining(expected.map(obj => expect.objectContaining(obj)))
    );
  };

  describe('policy → user', () => {
    it('creates only a direct edge when no access is granted', () => {
      const policy = createPolicyNode({});
      const user = createUserNode({ dataOverrides: {} });
      const ctx = createEdgeTestContext([], [policy, user]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, user);

      expect(updatedContext.edges).toHaveLength(1);
      expect(updatedContext.edges).toEqual(
        expect.arrayContaining([expect.objectContaining({ source: policy.id, target: user.id })])
      );
      expect(updatedContext.nodes_connnections).toEqual(
        expect.arrayContaining([{ from: policy, to: user }])
      );
    });

    it('creates extra edge (user → resource) when access is granted', () => {
      const user = createUserNode({});
      const resource = createResourceNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });

      const ctx = createEdgeTestContext([], [policy, user, resource]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, user);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: user.id },
        { source: user.id, target: resource.id },
      ]);

      expectConnections(updatedContext.nodes_connnections, [
        { from: policy, to: user },
        {
          from: user,
          to: resource,
          parent_edge_id: getEdgeName(policy.id, user.id),
        },
      ]);
    });

    it('skips extra edges (user → resource) when granted_access specifies\
       a source_node that does not match the user being connected', () => {
      const user = createUserNode({});
      const resource = createResourceNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
              source_node: 'non-existing-source-node-id',
            },
          ],
        },
      });

      const ctx = createEdgeTestContext([], [policy, user, resource]);
      const { updatedContext } = updateConnectionEdges(ctx, policy, user);

      expectEdges(updatedContext.edges, [{ source: policy.id, target: user.id }]);
      expectConnections(updatedContext.nodes_connnections, [{ from: policy, to: user }]);
    });
  });

  describe('policy → group', () => {
    it('creates only a direct edge if group has no users', () => {
      const policy = createPolicyNode({});
      const group = createGroupNode({});
      const ctx = createEdgeTestContext([], [policy, group]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, group);

      expectEdges(updatedContext.edges, [{ source: policy.id, target: group.id }]);
      expectConnections(updatedContext.nodes_connnections, [{ from: policy, to: group }]);
    });

    it('creates only a direct edge if users exist in group but policy grants no access', () => {
      const policy = createPolicyNode({});
      const group = createGroupNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext([{ from: user.id, to: group.id }], [policy, group, user]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, group);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: group.id },
        { source: user.id, target: group.id },
      ]);
      expectConnections(updatedContext.nodes_connnections, [
        { from: user, to: group },
        { from: policy, to: group },
      ]);
    });

    it('creates extra edge (user → resource) if users exist and policy grants access', () => {
      const resource = createResourceNode({});
      const user = createUserNode({});
      const group = createGroupNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });

      const ctx = createEdgeTestContext(
        [{ from: user.id, to: group.id }],
        [policy, group, user, resource]
      );

      const { updatedContext } = updateConnectionEdges(ctx, policy, group);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: group.id },
        { source: user.id, target: group.id },
        { source: user.id, target: resource.id },
      ]);
      expectConnections(updatedContext.nodes_connnections, [
        { from: policy, to: group },
        { from: user, to: group },
        {
          from: user,
          to: resource,
          parent_edge_id: getEdgeName(policy.id, group.id),
        },
      ]);
    });
  });

  describe('policy → role', () => {
    it('creates only a direct edge if has has no users', () => {
      const policy = createPolicyNode({});
      const role = createRoleNode({});
      const ctx = createEdgeTestContext([], [policy, role]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, role);

      expectEdges(updatedContext.edges, [{ source: policy.id, target: role.id }]);
      expectConnections(updatedContext.nodes_connnections, [{ from: policy, to: role }]);
    });

    it('skips extra edges (user → resource) when policies don’t grant access', () => {
      const user = createUserNode({});
      const policy = createPolicyNode({});
      const role = createRoleNode({});
      const ctx = createEdgeTestContext([{ from: user.id, to: role.id }], [policy, role, user]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, role);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: role.id },
        { source: user.id, target: role.id },
      ]);
      expectConnections(updatedContext.nodes_connnections, [
        { from: user, to: role },
        { from: policy, to: role },
      ]);
    });

    it('creates extra edge (user → resource) if user exists and policy grants access', () => {
      const user = createUserNode({});
      const resource = createResourceNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });
      const role = createRoleNode({});
      const ctx = createEdgeTestContext(
        [{ from: user.id, to: role.id }],
        [policy, role, user, resource]
      );

      const { updatedContext } = updateConnectionEdges(ctx, policy, role);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: role.id },
        { source: user.id, target: role.id },
        { source: user.id, target: resource.id },
      ]);
      expectConnections(updatedContext.nodes_connnections, [
        { from: policy, to: role },
        { from: user, to: role },
        {
          from: user,
          to: resource,
          parent_edge_id: getEdgeName(policy.id, role.id),
        },
      ]);
    });
  });

  describe('user → group', () => {
    it('creates only a direct edge if group has no policies', () => {
      const user = createUserNode({});
      const group = createGroupNode({});
      const ctx = createEdgeTestContext([], [user, group]);

      const { updatedContext } = updateConnectionEdges(ctx, user, group);

      expectEdges(updatedContext.edges, [{ source: user.id, target: group.id }]);
      expectConnections(updatedContext.nodes_connnections, [{ from: user, to: group }]);
    });

    it('skips extra edges (user → resource) when attached policies don’t grant access', () => {
      const policy = createPolicyNode({});
      const group = createGroupNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext([{ from: policy.id, to: group.id }], [policy, group, user]);

      expect(ctx.edges).toHaveLength(1);

      const { updatedContext } = updateConnectionEdges(ctx, user, group);
      expectEdges(updatedContext.edges, [
        { source: policy.id, target: group.id },
        { source: user.id, target: group.id },
      ]);
      expectConnections(updatedContext.nodes_connnections, [
        { from: policy, to: group },
        { from: user, to: group },
      ]);
    });

    it('creates extra (user → resource) edge when attached policies grant access', () => {
      const resource = createResourceNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });
      const group = createGroupNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext(
        [{ from: policy.id, to: group.id }],
        [policy, group, user, resource]
      );

      const { updatedContext } = updateConnectionEdges(ctx, user, group);
      expectEdges(updatedContext.edges, [
        { source: policy.id, target: group.id },
        { source: user.id, target: group.id },
        { source: user.id, target: resource.id },
      ]);

      expectConnections(updatedContext.nodes_connnections, [
        { from: policy, to: group },
        { from: user, to: group },
        {
          from: user,
          to: resource,
          parent_edge_id: getEdgeName(user.id, group.id),
        },
      ]);
    });
  });

  describe('user → role', () => {
    it('creates only a direct edge if role has has no policies', () => {
      const role = createRoleNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext([], [role, user]);

      const { updatedContext } = updateConnectionEdges(ctx, user, role);

      expectEdges(updatedContext.edges, [{ source: user.id, target: role.id }]);
      expectConnections(updatedContext.nodes_connnections, [{ from: user, to: role }]);
    });

    it('skips extra edges (user → resource) when role’s policies grant no access', () => {
      const user = createUserNode({});
      const policy = createPolicyNode({});
      const role = createRoleNode({});
      const ctx = createEdgeTestContext([{ from: user.id, to: role.id }], [policy, role, user]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, role);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: role.id },
        { source: user.id, target: role.id },
      ]);
      expectConnections(updatedContext.nodes_connnections, [
        { from: user, to: role },
        { from: policy, to: role },
      ]);
    });
  });

  describe('role → resource', () => {
    it('creates only a direct edge if role has no policies attached', () => {
      const role = createRoleNode({});
      const resource = createResourceNode({});
      const ctx = createEdgeTestContext([], [role, resource]);

      const { updatedContext } = updateConnectionEdges(ctx, role, resource);
      expectEdges(updatedContext.edges, [{ source: role.id, target: resource.id }]);
      expectConnections(updatedContext.nodes_connnections, [{ from: role, to: resource }]);
    });

    it(`creates extra (resource → resource) edge
      if role has associated policies which grant access`, () => {
      const resource1 = createResourceNode({});
      const resource2 = createResourceNode({});
      const role = createRoleNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource2.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });

      const ctx = createEdgeTestContext(
        [{ from: policy.id, to: role.id }],
        [role, resource1, resource2, policy]
      );

      const { updatedContext } = updateConnectionEdges(ctx, role, resource1);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: role.id },
        { source: role.id, target: resource1.id },
        { source: resource1.id, target: resource2.id },
      ]);

      expectConnections(updatedContext.nodes_connnections, [
        { from: policy, to: role },
        { from: role, to: resource1 },
        {
          from: resource1,
          to: resource2,
          parent_edge_id: getEdgeName(role.id, resource1.id),
        },
      ]);
    });
  });
});
