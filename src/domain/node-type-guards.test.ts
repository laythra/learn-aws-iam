import { describe, expect, it } from 'vitest';

import { isNodeOfEntity, isNodeOfAnyEntity } from '@/domain/node-type-guards';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

function makeNode(entity: IAMNodeEntity): IAMAnyNode {
  return { data: { entity } } as IAMAnyNode;
}

describe('isNodeOfEntity', () => {
  it('returns true when the node entity matches', () => {
    const node = makeNode(IAMNodeEntity.User);
    expect(isNodeOfEntity(node, IAMNodeEntity.User)).toBe(true);
  });

  it('returns false when the node entity does not match', () => {
    const node = makeNode(IAMNodeEntity.User);
    expect(isNodeOfEntity(node, IAMNodeEntity.Role)).toBe(false);
  });
});

describe('isNodeOfAnyEntity', () => {
  it('returns true when the node matches one of the expected entities', () => {
    const node = makeNode(IAMNodeEntity.Role);
    expect(isNodeOfAnyEntity(node, [IAMNodeEntity.User, IAMNodeEntity.Role])).toBe(true);
  });

  it('returns false when the node matches none of the expected entities', () => {
    const node = makeNode(IAMNodeEntity.Group);
    expect(isNodeOfAnyEntity(node, [IAMNodeEntity.User, IAMNodeEntity.Role])).toBe(false);
  });

  it('returns false for an empty expected array', () => {
    const node = makeNode(IAMNodeEntity.User);
    expect(isNodeOfAnyEntity(node, [])).toBe(false);
  });
});
