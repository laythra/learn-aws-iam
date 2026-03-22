import { describe, expect, it } from 'vitest';

import { getEdgeName, getEdgeLabel, validateIAMName } from '@/domain/iam-graph-utils';
import { IAMNodeEntity } from '@/types/iam-enums';

describe('getEdgeName', () => {
  it('creates edge name from source and target', () => {
    expect(getEdgeName('User1', 'Group1')).toBe('e:user_1:group_1');
  });

  it('includes attachedAs when provided', () => {
    expect(getEdgeName('User1', 'Group1', IAMNodeEntity.IdentityPolicy)).toBe(
      `e:user_1:group_1:${IAMNodeEntity.IdentityPolicy}`
    );
  });

  it('formats source and target names', () => {
    expect(getEdgeName('My User', 'My Group')).toBe('e:my_user:my_group');
  });
});

describe('getEdgeLabel', () => {
  it('returns label for IdentityPolicy -> User', () => {
    expect(getEdgeLabel(IAMNodeEntity.IdentityPolicy, IAMNodeEntity.User)).toBe('Attached to');
  });

  it('returns label for IdentityPolicy -> Group', () => {
    expect(getEdgeLabel(IAMNodeEntity.IdentityPolicy, IAMNodeEntity.Group)).toBe('Attached to');
  });

  it('returns label for Role -> User', () => {
    expect(getEdgeLabel(IAMNodeEntity.Role, IAMNodeEntity.User)).toBe('Assumes');
  });

  it('returns label for reversed direction lookup', () => {
    expect(getEdgeLabel(IAMNodeEntity.User, IAMNodeEntity.IdentityPolicy)).toBe('Attached to');
  });

  it('returns default label for unknown combinations', () => {
    expect(getEdgeLabel(IAMNodeEntity.Group, IAMNodeEntity.Account)).toBe('Attached To');
  });
});

describe('validateIAMName', () => {
  it('returns undefined for a valid name', () => {
    expect(validateIAMName('admin-user', [])).toBeUndefined();
  });

  it('rejects duplicate names (case-insensitive)', () => {
    expect(validateIAMName('Admin', ['admin', 'dev'])).toBe('Name is already in use');
  });

  it('rejects duplicate names (exact match)', () => {
    expect(validateIAMName('admin', ['admin', 'dev'])).toBe('Name is already in use');
  });

  it('rejects empty name', () => {
    expect(validateIAMName('', [])).toBe('Name must be between 1 and 64 characters long');
  });

  describe('max length per entity type', () => {
    it('defaults to 64 when no entity is provided', () => {
      const longName = 'a'.repeat(65);
      expect(validateIAMName(longName, [])).toBe('Name must be between 1 and 64 characters long');
    });

    it('enforces 64 char limit for User', () => {
      const longName = 'a'.repeat(65);
      expect(validateIAMName(longName, [], IAMNodeEntity.User)).toBe(
        'Name must be between 1 and 64 characters long'
      );
    });

    it('enforces 64 char limit for Role', () => {
      const longName = 'a'.repeat(65);
      expect(validateIAMName(longName, [], IAMNodeEntity.Role)).toBe(
        'Name must be between 1 and 64 characters long'
      );
    });

    it('enforces 128 char limit for Group', () => {
      const atLimit = 'a'.repeat(128);
      const overLimit = 'a'.repeat(129);
      expect(validateIAMName(atLimit, [], IAMNodeEntity.Group)).toBeUndefined();
      expect(validateIAMName(overLimit, [], IAMNodeEntity.Group)).toBe(
        'Name must be between 1 and 128 characters long'
      );
    });

    it('enforces 128 char limit for IdentityPolicy', () => {
      const atLimit = 'a'.repeat(128);
      const overLimit = 'a'.repeat(129);
      expect(validateIAMName(atLimit, [], IAMNodeEntity.IdentityPolicy)).toBeUndefined();
      expect(validateIAMName(overLimit, [], IAMNodeEntity.IdentityPolicy)).toBe(
        'Name must be between 1 and 128 characters long'
      );
    });

    it('accepts name at exactly the default max length', () => {
      expect(validateIAMName('a'.repeat(64), [])).toBeUndefined();
    });
  });

  it('accepts name starting with a special character', () => {
    expect(validateIAMName('-admin', [])).toBeUndefined();
  });

  it('accepts name starting with number', () => {
    expect(validateIAMName('1admin', [])).toBeUndefined();
  });

  it('rejects name with invalid characters', () => {
    expect(validateIAMName('admin user', [])).toBe(
      'Name can only contain letters, numbers, and the characters +=,.@_-'
    );
  });

  it('accepts name with all valid special characters', () => {
    expect(validateIAMName('admin+=,.@_-test', [])).toBeUndefined();
  });
});
