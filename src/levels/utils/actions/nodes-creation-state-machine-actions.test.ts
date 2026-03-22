import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createIAMNode, createUserGroupNode } from './nodes-creation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import {
  createMockPolicyCreationObjective,
  createMockUserGroupCreationObjective,
} from '@/__test-helpers__/objectives';
import { findAnyValidObjective } from '@/domain/iam-policy-validator';
import { IAMNodeEntity } from '@/types/iam-enums';

vi.mock('@/domain/iam-policy-validator', () => ({
  findAnyValidObjective: vi.fn(),
}));

vi.mock('@/runtime/functions-registry', () => ({
  GetLevelValidateFunctions: vi.fn(() => ({})),
}));

vi.mock('@/levels/common-state-machine-setup', () => ({
  createStateMachineSetup: vi.fn(),
}));

describe('createIAMNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets unnecessary_node: true and emits no events when no objective matches', () => {
    vi.mocked(findAnyValidObjective).mockReturnValue(undefined);
    const context = createMockContext({});
    const { createdNode, events } = createIAMNode(
      context,
      '{}',
      'Test Policy',
      IAMNodeEntity.IdentityPolicy
    );

    expect(createdNode.data.unnecessary_node).toBe(true);
    expect(events).toEqual([]);
  });

  it('sets unnecessary_node: false and emits on_finish_event when objective matches', () => {
    const mockObjective = createMockPolicyCreationObjective();
    vi.mocked(findAnyValidObjective).mockReturnValue(mockObjective);
    const context = createMockContext({ policy_creation_objectives: [mockObjective] });
    const { createdNode, events } = createIAMNode(
      context,
      '{}',
      'Test Policy',
      IAMNodeEntity.IdentityPolicy
    );

    expect(createdNode.data.unnecessary_node).toBe(false);
    expect(events).toContain(mockObjective.on_finish_event);
  });
});

describe.each([
  [IAMNodeEntity.User, 'User'],
  [IAMNodeEntity.Group, 'Group'],
] as const)('createUserGroupNode — %s', (nodeType, _label) => {
  it('sets unnecessary_node: false when a matching objective exists', () => {
    const objective = createMockUserGroupCreationObjective({}, nodeType);
    const context = createMockContext({ user_group_creation_objectives: [objective] });
    const { createdNode } = createUserGroupNode(context, nodeType, { label: 'test' });

    expect(createdNode.data.unnecessary_node).toBe(false);
  });

  it('sets unnecessary_node: true and emits no events when no objectives exist', () => {
    const context = createMockContext({ user_group_creation_objectives: [] });
    const { createdNode, events } = createUserGroupNode(context, nodeType, { label: 'test' });

    expect(createdNode.data.unnecessary_node).toBe(true);
    expect(events).toEqual([]);
  });
});
