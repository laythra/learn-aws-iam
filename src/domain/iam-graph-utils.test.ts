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
    expect(getEdgeLabel(IAMNodeEntity.IdentityPolicy, IAMNodeEntity.Group)).toBe('Belongs to');
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

  it('rejects duplicate names', () => {
    expect(validateIAMName('admin', ['admin', 'dev'])).toBe('Name is already in use');
  });

  it('rejects empty name', () => {
    expect(validateIAMName('', [])).toBe('Name must be between 1 and 64 characters long');
  });

  it('rejects name exceeding max length', () => {
    const longName = 'a'.repeat(65);
    expect(validateIAMName(longName, [])).toBe('Name must be between 1 and 64 characters long');
  });

  it('accepts name at exactly max length', () => {
    const exactName = 'a'.repeat(64);
    expect(validateIAMName(exactName, [])).toBeUndefined();
  });

  it('supports custom max length', () => {
    const name = 'a'.repeat(11);
    expect(validateIAMName(name, [], 10)).toBe('Name must be between 1 and 10 characters long');
  });

  it('rejects name starting with special character', () => {
    expect(validateIAMName('-admin', [])).toBe('Name must start with a letter or number');
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
