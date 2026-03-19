import { describe, expect, it } from 'vitest';

import { getValidConnectionDirection } from '@/features/canvas/utils/edges-creation';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

function makeNode(id: string, entity: IAMNodeEntity): IAMAnyNode {
  return { id, data: { entity } } as IAMAnyNode;
}

describe('getValidConnectionDirection', () => {
  it('returns canonical direction for a valid connection', () => {
    const source = makeNode('policy-1', IAMNodeEntity.IdentityPolicy);
    const target = makeNode('user-1', IAMNodeEntity.User);

    const result = getValidConnectionDirection(source, target);
    expect(result).toBeDefined();
    expect(result!.source.id).toBe('policy-1');
    expect(result!.target.id).toBe('user-1');
  });

  it('swaps nodes when connected in reverse order', () => {
    const source = makeNode('user-1', IAMNodeEntity.User);
    const target = makeNode('policy-1', IAMNodeEntity.IdentityPolicy);

    const result = getValidConnectionDirection(source, target);
    expect(result).toBeDefined();
    // Should swap to canonical: IdentityPolicy -> User
    expect(result!.source.id).toBe('policy-1');
    expect(result!.target.id).toBe('user-1');
  });

  it('returns undefined for an invalid connection', () => {
    const source = makeNode('group-1', IAMNodeEntity.Group);
    const target = makeNode('account-1', IAMNodeEntity.Account);

    expect(getValidConnectionDirection(source, target)).toBeUndefined();
  });

  it('allows User -> Group connection', () => {
    const user = makeNode('user-1', IAMNodeEntity.User);
    const group = makeNode('group-1', IAMNodeEntity.Group);

    const result = getValidConnectionDirection(user, group);
    expect(result).toBeDefined();
  });

  it('allows User -> Role connection', () => {
    const user = makeNode('user-1', IAMNodeEntity.User);
    const role = makeNode('role-1', IAMNodeEntity.Role);

    const result = getValidConnectionDirection(user, role);
    expect(result).toBeDefined();
  });

  it('allows SCP -> OU connection', () => {
    const scp = makeNode('scp-1', IAMNodeEntity.SCP);
    const ou = makeNode('ou-1', IAMNodeEntity.OU);

    const result = getValidConnectionDirection(scp, ou);
    expect(result).toBeDefined();
  });

  it('allows SCP -> Account connection', () => {
    const scp = makeNode('scp-1', IAMNodeEntity.SCP);
    const account = makeNode('acct-1', IAMNodeEntity.Account);

    const result = getValidConnectionDirection(scp, account);
    expect(result).toBeDefined();
  });

  it('allows PermissionBoundary -> User connection', () => {
    const pb = makeNode('pb-1', IAMNodeEntity.PermissionBoundary);
    const user = makeNode('user-1', IAMNodeEntity.User);

    const result = getValidConnectionDirection(pb, user);
    expect(result).toBeDefined();
  });

  it('allows PermissionBoundary -> Role connection', () => {
    const pb = makeNode('pb-1', IAMNodeEntity.PermissionBoundary);
    const role = makeNode('role-1', IAMNodeEntity.Role);

    const result = getValidConnectionDirection(pb, role);
    expect(result).toBeDefined();
  });

  it('rejects connection between two nodes of the same entity type', () => {
    const user1 = makeNode('user-1', IAMNodeEntity.User);
    const user2 = makeNode('user-2', IAMNodeEntity.User);

    expect(getValidConnectionDirection(user1, user2)).toBeUndefined();
  });
});
