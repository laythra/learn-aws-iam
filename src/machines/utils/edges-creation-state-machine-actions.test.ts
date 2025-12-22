import { describe, it, expect, vi } from 'vitest';

import { applyInitialNodeConnections } from './apply-initial-edges-state-machine-actions';
import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import {
  GetLevelGuardRailsBlockedEdgesFns,
  GetLevelObjectivesApplicableNodesFns,
} from '../functions-registry';
import { createMockContext } from '@/__test-helpers__/context';
import { createAccountNode } from '@/factories/nodes/account-node-factory';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { createOUNode } from '@/factories/nodes/ou-node-factory';
import { createPermissionBoundaryNode } from '@/factories/nodes/permission-boundary-node-factory';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { createSCPNode } from '@/factories/nodes/scp-node-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { AccessLevel, IAMAnyNode, IAMEdge } from '@/types';

type ExpectedEdge = {
  source: string;
  target: string;
  data?: Partial<IAMEdge['data']>;
};

vi.mock('@/machines/functions-registry', () => ({
  GetLevelObjectivesApplicableNodesFns: vi.fn(() => ({})),
  GetLevelGuardRailsBlockedEdgesFns: vi.fn(() => ({})),
  GetLevelValidateFunctionsFns: vi.fn(() => ({})),
}));

describe('updateConnectionEdges', () => {
  /**
   * A convinience function to create a mock context with resolved edges and connections.
   * @param connections Initial connections between nodes.
   * @param nodes Initial nodes in the context.
   * @returns Mock context with resolved edges and connections.
   */
  const createEdgeTestContext = (
    connections: { from: string; to: string }[] = [],
    nodes: IAMAnyNode[]
  ): ReturnType<typeof createMockContext> => {
    const ctx = createMockContext({ nodes });
    const { edges } = applyInitialNodeConnections(ctx, connections);
    return { ...ctx, edges };
  };

  beforeEach(() => {
    vi.mocked(GetLevelObjectivesApplicableNodesFns).mockReturnValue(
      new Proxy(
        {},
        {
          get: () => (nodes: IAMAnyNode[]) => nodes,
        }
      )
    );
  });

  const expectEdges = (edges: IAMEdge[], expected: ExpectedEdge[]): void => {
    expect(edges).toHaveLength(expected.length);
    expect(edges).toEqual(
      expect.arrayContaining(
        expected.map(obj =>
          expect.objectContaining({
            source: obj.source,
            target: obj.target,
            ...(obj.data ? { data: expect.objectContaining(obj.data) } : {}),
          })
        )
      )
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
    });

    it('skips extra edges (user → resource) when granted_access specifies\
       a source_node that does not match the user being connected', () => {
      vi.mocked(GetLevelObjectivesApplicableNodesFns).mockImplementation(() => ({
        NONE_MATCHING_FN: () => [],
      }));

      const user = createUserNode({});
      const resource = createResourceNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
              applicable_nodes_fn_name: 'NONE_MATCHING_FN',
            },
          ],
        },
      });

      const ctx = createEdgeTestContext([], [policy, user, resource]);
      const { updatedContext } = updateConnectionEdges(ctx, policy, user);

      expectEdges(updatedContext.edges, [{ source: policy.id, target: user.id }]);
    });

    it('marks extra edges (user → resource) as blocked when access is granted\
       but a permission boundary blocks it', () => {
      const user = createUserNode({});
      const resource = createResourceNode({});
      vi.mocked(GetLevelGuardRailsBlockedEdgesFns).mockImplementation(() => ({
        MOCK_BLOCKING_FN: (edge: IAMEdge) => edge.source === user.id && edge.target === resource.id,
      }));

      const permissionBoundary = createPermissionBoundaryNode({
        dataOverrides: {
          is_edge_blocked_fn_name: 'MOCK_BLOCKING_FN',
        },
      });

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
        [{ from: permissionBoundary.id, to: user.id }],
        [policy, user, resource, permissionBoundary]
      );
      const { updatedContext } = updateConnectionEdges(ctx, policy, user);

      expectEdges(updatedContext.edges, [
        { source: permissionBoundary.id, target: user.id },
        { source: policy.id, target: user.id },
        { source: user.id, target: resource.id, data: { is_blocked: true } },
      ]);
    });
  });

  describe('policy → group', () => {
    it('creates only a direct edge if group has no users', () => {
      const policy = createPolicyNode({});
      const group = createGroupNode({});
      const ctx = createEdgeTestContext([], [policy, group]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, group);

      expectEdges(updatedContext.edges, [{ source: policy.id, target: group.id }]);
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
    });
  });

  describe('policy → role', () => {
    it('creates only a direct edge if has has no users', () => {
      const policy = createPolicyNode({});
      const role = createRoleNode({});
      const ctx = createEdgeTestContext([], [policy, role]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, role);

      expectEdges(updatedContext.edges, [{ source: policy.id, target: role.id }]);
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
    });

    it('marks extra edges (user → resource) as blocked when access is granted\
       but a permission boundary blocks it', () => {
      const user = createUserNode({});
      const resource = createResourceNode({});
      const role = createRoleNode({});
      vi.mocked(GetLevelGuardRailsBlockedEdgesFns).mockImplementation(() => ({
        MOCK_BLOCKING_FN: (edge: IAMEdge) => edge.source === user.id && edge.target === resource.id,
      }));
      const permissionBoundary = createPermissionBoundaryNode({
        dataOverrides: {
          is_edge_blocked_fn_name: 'MOCK_BLOCKING_FN',
        },
      });

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
        [
          { from: permissionBoundary.id, to: role.id },
          { from: policy.id, to: role.id },
        ],
        [policy, user, resource, permissionBoundary, role]
      );
      const { updatedContext } = updateConnectionEdges(ctx, user, role);

      expectEdges(updatedContext.edges, [
        { source: user.id, target: role.id },
        { source: permissionBoundary.id, target: role.id },
        { source: policy.id, target: role.id },
        { source: user.id, target: resource.id, data: { is_blocked: true } },
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
    });
  });

  describe('user → role', () => {
    it('creates only a direct edge if role has has no policies', () => {
      const role = createRoleNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext([], [role, user]);

      const { updatedContext } = updateConnectionEdges(ctx, user, role);

      expectEdges(updatedContext.edges, [{ source: user.id, target: role.id }]);
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
    });
  });

  describe('resource → role', () => {
    it('creates only a direct edge if role has no policies attached', () => {
      const role = createRoleNode({});
      const resource = createResourceNode({});
      const ctx = createEdgeTestContext([], [role, resource]);

      const { updatedContext } = updateConnectionEdges(ctx, resource, role);
      expectEdges(updatedContext.edges, [{ source: resource.id, target: role.id }]);
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

      const { updatedContext } = updateConnectionEdges(ctx, resource1, role);

      expectEdges(updatedContext.edges, [
        { source: policy.id, target: role.id },
        { source: resource1.id, target: role.id },
        { source: resource1.id, target: resource2.id },
      ]);
    });
  });

  describe('SCP -> OU', () => {
    const ouNode = createOUNode({});
    const accountNode = createAccountNode({});
    const dataOverrides = {
      account_id: accountNode.id,
      ou_id: ouNode.id,
    };

    it('blocks access for nodes affected by the SCP in an account under the OU', () => {
      const userNode = createUserNode({ dataOverrides });
      const resourceNode = createResourceNode({ dataOverrides });
      vi.mocked(GetLevelGuardRailsBlockedEdgesFns).mockImplementation(() => ({
        MOCK_BLOCKING_FN: (edge: IAMEdge) =>
          edge.source === userNode.id && edge.target === resourceNode.id,
      }));

      const scpNode = createSCPNode({
        dataOverrides: {
          is_edge_blocked_fn_name: 'MOCK_BLOCKING_FN',
          ...dataOverrides,
        },
      });
      const policyNode = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resourceNode.id,
              target_handle: 'mock-target-handle',
            },
          ],
          ...dataOverrides,
        },
      });

      const ctx = createEdgeTestContext(
        [
          {
            from: policyNode.id,
            to: userNode.id,
          },
          {
            from: ouNode.id,
            to: accountNode.id,
          },
        ],
        [accountNode, ouNode, userNode, resourceNode, policyNode, scpNode]
      );

      expectEdges(ctx.edges, [
        { source: policyNode.id, target: userNode.id },
        { source: userNode.id, target: resourceNode.id },
        { source: ouNode.id, target: accountNode.id },
      ]);

      const { updatedContext } = updateConnectionEdges(ctx, scpNode, ouNode);

      expectEdges(updatedContext.edges, [
        { source: policyNode.id, target: userNode.id, data: { is_blocked: false } },
        { source: ouNode.id, target: accountNode.id, data: { is_blocked: false } },
        { source: scpNode.id, target: ouNode.id, data: { is_blocked: false } },
        { source: userNode.id, target: resourceNode.id, data: { is_blocked: true } },
      ]);
    });

    it('blocks access for nodes affected by the SCP attached to the account', () => {
      const userNode = createUserNode({ dataOverrides });
      const resourceNode = createResourceNode({ dataOverrides });
      vi.mocked(GetLevelGuardRailsBlockedEdgesFns).mockImplementation(() => ({
        MOCK_BLOCKING_FN: (edge: IAMEdge) =>
          edge.source === userNode.id && edge.target === resourceNode.id,
      }));

      const scpNode = createSCPNode({
        dataOverrides: {
          is_edge_blocked_fn_name: 'MOCK_BLOCKING_FN',
        },
      });

      const policyNode = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resourceNode.id,
              target_handle: 'mock-target-handle',
            },
          ],
          ...dataOverrides,
        },
      });

      const ctx = createEdgeTestContext(
        [
          {
            from: policyNode.id,
            to: userNode.id,
          },
          {
            from: scpNode.id,
            to: ouNode.id,
          },
        ],
        [accountNode, userNode, resourceNode, policyNode, scpNode, ouNode]
      );

      expectEdges(ctx.edges, [
        { source: policyNode.id, target: userNode.id },
        { source: userNode.id, target: resourceNode.id },
        { source: scpNode.id, target: ouNode.id },
      ]);

      const { updatedContext } = updateConnectionEdges(ctx, scpNode, accountNode);

      expectEdges(updatedContext.edges, [
        { source: policyNode.id, target: userNode.id, data: { is_blocked: false } },
        { source: scpNode.id, target: accountNode.id, data: { is_blocked: false } },
        { source: userNode.id, target: resourceNode.id, data: { is_blocked: true } },
        { source: scpNode.id, target: ouNode.id, data: { is_blocked: false } },
      ]);
    });
  });

  describe('permission boundary → user', () => {
    it('marks already existing edges affected by the permission boundary as blocked', () => {
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
      vi.mocked(GetLevelGuardRailsBlockedEdgesFns).mockImplementation(() => ({
        MOCK_BLOCKING_FN: (edge: IAMEdge) => edge.source === user.id && edge.target === resource.id,
      }));

      const ctx = createEdgeTestContext(
        [{ from: policy.id, to: user.id }],
        [user, resource, policy]
      );

      const permissionBoundary = createPermissionBoundaryNode({
        dataOverrides: {
          is_edge_blocked_fn_name: 'MOCK_BLOCKING_FN',
        },
      });

      const { updatedContext } = updateConnectionEdges(ctx, permissionBoundary, user);
      expectEdges(updatedContext.edges, [
        { source: permissionBoundary.id, target: user.id },
        { source: policy.id, target: user.id },
        { source: user.id, target: resource.id, data: { is_blocked: true } },
      ]);
    });
  });
});
