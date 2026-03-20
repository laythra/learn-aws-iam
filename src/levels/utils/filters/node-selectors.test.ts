import { describe, it, expect, beforeEach } from 'vitest';

import { selectAffectingPermissionBoundaryNodes, selectAffectingSCPNodes } from './node-selectors';
import { createEdge } from '@/domain/edge-factory';
import { createAccountNode } from '@/domain/nodes/account-node-factory';
import { createOUNode } from '@/domain/nodes/ou-node-factory';
import { createPermissionBoundaryNode } from '@/domain/nodes/permission-boundary-node-factory';
import { createRoleNode } from '@/domain/nodes/role-node-factory';
import { createSCPNode } from '@/domain/nodes/scp-node-factory';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMEdge } from '@/types/iam-node-types';

const makeEdge = (
  source: string,
  target: string,
  sourceNode: IAMEdge['data']['source_node'],
  targetNode: IAMEdge['data']['target_node']
): IAMEdge =>
  createEdge({
    rootOverrides: { source, target },
    dataOverrides: { source_node: sourceNode, target_node: targetNode },
  });

describe('selectAffectingPermissionBoundaryNodes', () => {
  const user = createUserNode({ rootOverrides: { id: 'user-1' }, dataOverrides: { id: 'user-1' } });
  const role = createRoleNode({ rootOverrides: { id: 'role-1' }, dataOverrides: { id: 'role-1' } });
  const pb1 = createPermissionBoundaryNode({
    rootOverrides: { id: 'pb-1' },
    dataOverrides: { id: 'pb-1' },
  });
  const pb2 = createPermissionBoundaryNode({
    rootOverrides: { id: 'pb-2' },
    dataOverrides: { id: 'pb-2' },
  });
  const scp1 = createSCPNode({ rootOverrides: { id: 'scp-1' }, dataOverrides: { id: 'scp-1' } });

  let edges: IAMEdge[];

  beforeEach(() => {
    edges = [
      makeEdge('pb-1', 'user-1', pb1, user),
      makeEdge('pb-2', 'user-1', pb2, user),
      makeEdge('pb-1', 'role-1', pb1, role),
      makeEdge('scp-1', 'user-1', scp1, user),
    ];
  });

  it('returns permission boundary nodes connected to the target', () => {
    const result = selectAffectingPermissionBoundaryNodes(edges, user);
    expect(result).toHaveLength(2);
    expect(result.map(n => n.id)).toEqual(expect.arrayContaining(['pb-1', 'pb-2']));
  });

  it('excludes non-permission-boundary sources (e.g. SCP)', () => {
    const result = selectAffectingPermissionBoundaryNodes(edges, user);
    expect(result.every(n => n.data.entity === IAMNodeEntity.PermissionBoundary)).toBe(true);
  });

  it('returns only boundaries connected to the specific target', () => {
    const result = selectAffectingPermissionBoundaryNodes(edges, role);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('pb-1');
  });

  it('returns empty when no permission boundaries affect the target', () => {
    const unrelatedNode = createUserNode({
      rootOverrides: { id: 'user-99' },
      dataOverrides: { id: 'user-99' },
    });
    const result = selectAffectingPermissionBoundaryNodes(edges, unrelatedNode);
    expect(result).toHaveLength(0);
  });

  it('returns empty when edges array is empty', () => {
    const result = selectAffectingPermissionBoundaryNodes([], user);
    expect(result).toHaveLength(0);
  });
});

describe('selectAffectingSCPNodes', () => {
  const accountId = 'account-1';
  const ouId = 'ou-1';

  const user = createUserNode({
    rootOverrides: { id: 'user-1' },
    dataOverrides: { id: 'user-1', account_id: accountId, ou_id: ouId },
  });
  const userNoOU = createUserNode({
    rootOverrides: { id: 'user-2' },
    dataOverrides: { id: 'user-2', account_id: accountId, ou_id: undefined },
  });
  const userOrphaned = createUserNode({
    rootOverrides: { id: 'user-3' },
    dataOverrides: { id: 'user-3', account_id: undefined, ou_id: undefined },
  });

  const account = createAccountNode({
    rootOverrides: { id: accountId },
    dataOverrides: { id: accountId },
  });
  const ou = createOUNode({ rootOverrides: { id: ouId }, dataOverrides: { id: ouId } });

  const scp1 = createSCPNode({ rootOverrides: { id: 'scp-1' }, dataOverrides: { id: 'scp-1' } });
  const scp2 = createSCPNode({ rootOverrides: { id: 'scp-2' }, dataOverrides: { id: 'scp-2' } });
  const pb = createPermissionBoundaryNode({
    rootOverrides: { id: 'pb-1' },
    dataOverrides: { id: 'pb-1' },
  });

  let edges: IAMEdge[];

  beforeEach(() => {
    edges = [
      makeEdge('scp-1', accountId, scp1, account),
      makeEdge('scp-2', ouId, scp2, ou),
      makeEdge('pb-1', accountId, pb, account),
    ];
  });

  it('returns SCPs connected to the account the target belongs to', () => {
    const result = selectAffectingSCPNodes(edges, userNoOU);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('scp-1');
  });

  it('returns SCPs connected to the OU the target belongs to', () => {
    const userOUOnly = createUserNode({
      rootOverrides: { id: 'user-ou' },
      dataOverrides: { id: 'user-ou', account_id: undefined, ou_id: ouId },
    });
    const result = selectAffectingSCPNodes(edges, userOUOnly);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('scp-2');
  });

  it('returns SCPs from both account and OU when target has both', () => {
    const result = selectAffectingSCPNodes(edges, user);
    expect(result).toHaveLength(2);
    expect(result.map(n => n.id)).toEqual(expect.arrayContaining(['scp-1', 'scp-2']));
  });

  it('excludes non-SCP sources (e.g. permission boundary)', () => {
    const result = selectAffectingSCPNodes(edges, user);
    expect(result.every(n => n.data.entity === IAMNodeEntity.SCP)).toBe(true);
  });

  it('returns empty when target has no account_id or ou_id', () => {
    const result = selectAffectingSCPNodes(edges, userOrphaned);
    expect(result).toHaveLength(0);
  });

  it('returns empty when edges array is empty', () => {
    const result = selectAffectingSCPNodes([], user);
    expect(result).toHaveLength(0);
  });
});
