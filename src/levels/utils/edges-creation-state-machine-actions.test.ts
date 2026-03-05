import { describe, it, expect, vi, beforeEach } from 'vitest';

import { applyInitialNodeConnections } from './apply-initial-edges-state-machine-actions';
import {
  updateConnectionEdges,
  applyGuardRailBlockingToEdges,
  deleteConnectionEdges,
} from './edges-creation-state-machine-actions';
import {
  GetLevelGuardRailsBlockedEdgesFns,
  GetLevelObjectivesApplicableNodesFns,
} from '../functions-registry';
import { createMockContext } from '@/__test-helpers__/context';
import { createEdge } from '@/factories/edge-factory';
import { createAccountNode } from '@/factories/nodes/account-node-factory';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { createOUNode } from '@/factories/nodes/ou-node-factory';
import { createPermissionBoundaryNode } from '@/factories/nodes/permission-boundary-node-factory';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { createSCPNode } from '@/factories/nodes/scp-node-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { AccessLevel } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

type ExpectedEdge = {
  source: string;
  target: string;
  data?: Partial<IAMEdge['data']>;
};

vi.mock('@/levels/functions-registry', () => ({
  GetLevelObjectivesApplicableNodesFns: vi.fn(() => ({})),
  GetLevelGuardRailsBlockedEdgesFns: vi.fn(() => ({})),
  GetLevelValidateFunctionsFns: vi.fn(() => ({})),
}));

const createEdgeTestContext = (
  connections: { from: string; to: string }[] = [],
  nodes: IAMAnyNode[]
): ReturnType<typeof createMockContext> => {
  const ctx = createMockContext({ nodes });
  const { edges } = applyInitialNodeConnections(ctx, connections);
  return { ...ctx, edges };
};

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

describe('updateConnectionEdges', () => {
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

    it('appends parent_edge_ids when the same dependent edge is created by another parent', () => {
      const user = createUserNode({});
      const resource = createResourceNode({});
      const policy1 = createPolicyNode({
        dataOverrides: {
          id: 'policy-a',
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });
      const policy2 = createPolicyNode({
        dataOverrides: {
          id: 'policy-b',
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              target_node: resource.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });

      const ctx = createEdgeTestContext([], [policy1, policy2, user, resource]);
      const { updatedContext: ctx1 } = updateConnectionEdges(ctx, policy1, user);
      const { updatedContext: ctx2 } = updateConnectionEdges(ctx1, policy2, user);

      const dependentEdge = ctx2.edges.find(
        edge => edge.source === user.id && edge.target === resource.id
      );
      const parentEdge1 = ctx2.edges.find(
        edge => edge.source === policy1.id && edge.target === user.id
      );
      const parentEdge2 = ctx2.edges.find(
        edge => edge.source === policy2.id && edge.target === user.id
      );

      expect(dependentEdge?.data.parent_edge_ids).toEqual(
        expect.arrayContaining([parentEdge1!.id, parentEdge2!.id])
      );
      expect(dependentEdge?.data.parent_edge_ids).toHaveLength(2);
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
    it('creates only a direct edge if role has no users', () => {
      const policy = createPolicyNode({});
      const role = createRoleNode({});
      const ctx = createEdgeTestContext([], [policy, role]);

      const { updatedContext } = updateConnectionEdges(ctx, policy, role);

      expectEdges(updatedContext.edges, [{ source: policy.id, target: role.id }]);
    });

    it("skips extra edges (user → resource) when policies don't grant access", () => {
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
  });

  describe('user → group', () => {
    it('creates only a direct edge if group has no policies', () => {
      const user = createUserNode({});
      const group = createGroupNode({});
      const ctx = createEdgeTestContext([], [user, group]);

      const { updatedContext } = updateConnectionEdges(ctx, user, group);

      expectEdges(updatedContext.edges, [{ source: user.id, target: group.id }]);
    });

    it("skips extra edges (user → resource) when attached policies don't grant access", () => {
      const policy = createPolicyNode({});
      const group = createGroupNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext([{ from: policy.id, to: group.id }], [policy, group, user]);

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
    it('creates only a direct edge if role has no policies', () => {
      const role = createRoleNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext([], [role, user]);

      const { updatedContext } = updateConnectionEdges(ctx, user, role);

      expectEdges(updatedContext.edges, [{ source: user.id, target: role.id }]);
    });

    it("skips extra edges (user → resource) when role's policies grant no access", () => {
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

    it('creates extra (resource → resource) edge if \
      role has associated policies which grant access', () => {
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

  describe('SCP → OU', () => {
    it('creates only a direct edge', () => {
      const scpNode = createSCPNode({});
      const ouNode = createOUNode({});
      const ctx = createEdgeTestContext([], [scpNode, ouNode]);

      const { updatedContext } = updateConnectionEdges(ctx, scpNode, ouNode);

      expectEdges(updatedContext.edges, [{ source: scpNode.id, target: ouNode.id }]);
    });
  });

  describe('SCP → Account', () => {
    it('creates only a direct edge', () => {
      const scpNode = createSCPNode({});
      const accountNode = createAccountNode({});
      const ctx = createEdgeTestContext([], [scpNode, accountNode]);

      const { updatedContext } = updateConnectionEdges(ctx, scpNode, accountNode);

      expectEdges(updatedContext.edges, [{ source: scpNode.id, target: accountNode.id }]);
    });
  });

  describe('permission boundary → user', () => {
    it('creates only a direct edge', () => {
      const permissionBoundary = createPermissionBoundaryNode({});
      const user = createUserNode({});
      const ctx = createEdgeTestContext([], [user, permissionBoundary]);

      const { updatedContext } = updateConnectionEdges(ctx, permissionBoundary, user);

      expectEdges(updatedContext.edges, [{ source: permissionBoundary.id, target: user.id }]);
    });
  });

  describe('derived edge labels', () => {
    it('uses edge_label as hovering_label when provided', () => {
      const user = createUserNode({});
      const resource = createResourceNode({});
      const policy = createPolicyNode({
        dataOverrides: {
          granted_accesses: [
            {
              access_level: AccessLevel.Read,
              edge_label: 'Deployment Access',
              target_node: resource.id,
              target_handle: 'mock-target-handle',
            },
          ],
        },
      });

      const ctx = createEdgeTestContext([], [policy, user, resource]);
      const { updatedContext } = updateConnectionEdges(ctx, policy, user);

      const derivedEdge = updatedContext.edges.find(
        edge => edge.source === user.id && edge.target === resource.id
      );
      expect(derivedEdge?.data.hovering_label).toBe('Deployment Access');
    });

    it('falls back to access_level as hovering_label when edge_label is not provided', () => {
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

      const derivedEdge = updatedContext.edges.find(
        edge => edge.source === user.id && edge.target === resource.id
      );
      expect(derivedEdge?.data?.hovering_label).toBe(AccessLevel.Read);
    });
  });
});

describe('applyGuardRailBlockingToEdges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns edges unchanged when no guard rails exist', () => {
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

    const ctx = createEdgeTestContext([{ from: policy.id, to: user.id }], [policy, user, resource]);

    const { edgesAfterBlocking } = applyGuardRailBlockingToEdges(ctx.edges, ctx.nodes, 1);

    expectEdges(edgesAfterBlocking, [
      { source: policy.id, target: user.id, data: { is_blocked: false } },
      { source: user.id, target: resource.id, data: { is_blocked: false } },
    ]);
  });

  it('marks edges as blocked when permission boundary blocks them', () => {
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
      [
        { from: permissionBoundary.id, to: user.id },
        { from: policy.id, to: user.id },
      ],
      [policy, user, resource, permissionBoundary]
    );

    const { edgesAfterBlocking } = applyGuardRailBlockingToEdges(ctx.edges, ctx.nodes, 1);

    expectEdges(edgesAfterBlocking, [
      { source: permissionBoundary.id, target: user.id, data: { is_blocked: false } },
      { source: policy.id, target: user.id, data: { is_blocked: false } },
      { source: user.id, target: resource.id, data: { is_blocked: true } },
    ]);
  });

  it('marks edges as blocked when SCP attached to OU blocks them', () => {
    const ouNode = createOUNode({});
    const accountNode = createAccountNode({});
    const dataOverrides = {
      account_id: accountNode.id,
      ou_id: ouNode.id,
    };

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
        { from: policyNode.id, to: userNode.id },
        { from: ouNode.id, to: accountNode.id },
        { from: scpNode.id, to: ouNode.id },
      ],
      [accountNode, ouNode, userNode, resourceNode, policyNode, scpNode]
    );

    const { edgesAfterBlocking } = applyGuardRailBlockingToEdges(ctx.edges, ctx.nodes, 1);

    expectEdges(edgesAfterBlocking, [
      { source: policyNode.id, target: userNode.id, data: { is_blocked: false } },
      { source: ouNode.id, target: accountNode.id, data: { is_blocked: false } },
      { source: scpNode.id, target: ouNode.id, data: { is_blocked: false } },
      { source: userNode.id, target: resourceNode.id, data: { is_blocked: true } },
    ]);
  });

  it('marks edges as blocked when SCP attached to account blocks them', () => {
    const ouNode = createOUNode({});
    const accountNode = createAccountNode({});
    const dataOverrides = {
      account_id: accountNode.id,
      ou_id: ouNode.id,
    };

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
        { from: policyNode.id, to: userNode.id },
        { from: scpNode.id, to: ouNode.id },
        { from: scpNode.id, to: accountNode.id },
      ],
      [accountNode, userNode, resourceNode, policyNode, scpNode, ouNode]
    );

    const { edgesAfterBlocking } = applyGuardRailBlockingToEdges(ctx.edges, ctx.nodes, 1);

    expectEdges(edgesAfterBlocking, [
      { source: policyNode.id, target: userNode.id, data: { is_blocked: false } },
      { source: scpNode.id, target: accountNode.id, data: { is_blocked: false } },
      { source: userNode.id, target: resourceNode.id, data: { is_blocked: true } },
      { source: scpNode.id, target: ouNode.id, data: { is_blocked: false } },
    ]);
  });
});

describe('deleteConnectionEdges', () => {
  it('should delete the specified edges and their dependents from the context', () => {
    const policyNode = createPolicyNode({});
    const userNode = createUserNode({});
    const resourceNode = createResourceNode({});

    const edge1 = createEdge({ rootOverrides: { source: policyNode.id, target: userNode.id } });
    const edge2 = createEdge({
      rootOverrides: { source: userNode.id, target: resourceNode.id },
      dataOverrides: { parent_edge_ids: [edge1.id] },
    });

    const context = createMockContext({
      nodes: [policyNode, userNode, resourceNode],
      edges: [edge1, edge2],
    });

    const { updatedContext } = deleteConnectionEdges(context, [edge1.id]);

    expect(updatedContext.edges).toEqual([]);
  });

  it('should keep a dependent edge if it still has another parent', () => {
    const parent1 = createEdge({ rootOverrides: { source: 'policy-a', target: 'group-a' } });
    const parent2 = createEdge({ rootOverrides: { source: 'policy-b', target: 'group-b' } });
    const sharedChild = createEdge({
      rootOverrides: { source: 'user-a', target: 'resource-a' },
      dataOverrides: { parent_edge_ids: [parent1.id, parent2.id] },
    });

    const context = createMockContext({
      nodes: [],
      edges: [parent1, parent2, sharedChild],
    });

    const { updatedContext } = deleteConnectionEdges(context, [parent1.id]);
    const child = updatedContext.edges.find(edge => edge.id === sharedChild.id);

    expect(updatedContext.edges.map(edge => edge.id)).toEqual(
      expect.arrayContaining([parent2.id, sharedChild.id])
    );
    expect(child?.data.parent_edge_ids).toEqual([parent2.id]);
  });

  it('should delete a dependent edge after its last parent is deleted', () => {
    const parent1 = createEdge({ rootOverrides: { source: 'policy-a', target: 'group-a' } });
    const parent2 = createEdge({ rootOverrides: { source: 'policy-b', target: 'group-b' } });
    const sharedChild = createEdge({
      rootOverrides: { source: 'user-a', target: 'resource-a' },
      dataOverrides: { parent_edge_ids: [parent1.id, parent2.id] },
    });

    const context = createMockContext({
      nodes: [],
      edges: [parent1, parent2, sharedChild],
    });

    const { updatedContext } = deleteConnectionEdges(context, [parent1.id, parent2.id]);

    expect(updatedContext.edges).toEqual([]);
  });
});
