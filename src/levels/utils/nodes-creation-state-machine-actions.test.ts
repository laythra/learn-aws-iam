import { describe, it, expect, vi } from 'vitest';

import { createIAMNode, createUserGroupNode } from './nodes-creation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import {
  createMockPolicyCreationObjective,
  createMockUserGroupCreationObjective,
} from '@/__test-helpers__/objectives';
import { findAnyValidObjective } from '@/lib/iam/iam-policy-validator';
import { CreatableIAMNodeEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

vi.mock('@/lib/iam/iam-policy-validator', () => ({
  findAnyValidObjective: vi.fn(),
}));

vi.mock('@/levels/common-state-machine-setup', () => ({
  createStateMachineSetup: vi.fn(),
}));

describe('createPermissionPolicy', () => {
  let mockDocString: string;
  let mockLabel: string;
  let mockContext: ReturnType<typeof createMockContext>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDocString = 'mock-doc-string';
    mockLabel = 'mock-label';
    mockContext = createMockContext({});
  });

  it('creates unnecessary policy node without pulse animation \
     when no matching objective exists', () => {
    vi.mocked(findAnyValidObjective).mockReturnValue(undefined);

    const result = createIAMNode(mockContext, mockDocString, mockLabel, IAMNodeEntity.Policy);

    const createdNode = result.updatedContext.nodes.find(
      (n: IAMAnyNode) => n.data.entity === IAMNodeEntity.Policy
    );

    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: true,
        entity: IAMNodeEntity.Policy,
        granted_accesses: [],
        show_pulse_animation: false,
      },
    });

    expect(result.events).toEqual([]);
  });

  it('creates a new policy node with a matching objective and marks it as necessary \
    with pulse animation', () => {
    const mockObjective = createMockPolicyCreationObjective({
      on_finish_event: 'MOCK_EVENT',
    });
    mockContext = createMockContext({
      policy_creation_objectives: [mockObjective],
    });

    vi.mocked(findAnyValidObjective).mockReturnValue(mockObjective);

    const result = createIAMNode(mockContext, mockDocString, mockLabel, IAMNodeEntity.Policy);
    const createdNode = result.updatedContext.nodes.find(
      (n: IAMAnyNode) => n.data.entity === IAMNodeEntity.Policy
    );

    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: false,
        entity: IAMNodeEntity.Policy,
        granted_accesses: [],
        show_pulse_animation: true,
      },
    });

    expect(result.events).toEqual(['MOCK_EVENT']);
  });
});

describe.each([
  ['User', IAMNodeEntity.User],
  ['Group', IAMNodeEntity.Group],
])('createUserGroupNode (%s)', (_, entityType) => {
  it('creates node and returns event if valid objective is found', () => {
    const mockLabel = `mock_${entityType.toLowerCase()}`;
    const mockObjective = createMockUserGroupCreationObjective({
      on_finish_event: `${entityType}_CREATED`,
      entity_to_create: entityType as CreatableIAMNodeEntity,
    });

    const mockContext = createMockContext({
      user_group_creation_objectives: [mockObjective],
    });

    const result = createUserGroupNode(
      mockContext,
      entityType as IAMNodeEntity.User | IAMNodeEntity.Group,
      { label: mockLabel }
    );

    const createdNode = result.updatedContext.nodes.find(
      (n: IAMAnyNode) => entityType === n.data.entity
    );
    expect(createdNode).toBeDefined();
    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: false,
        entity: entityType,
        show_pulse_animation: true,
      },
    });
  });

  it(`creates a new user or group node, updates the context,
      and returns no events when no valid objective is found`, () => {
    const mockLabel = `mock_${entityType.toLowerCase()}`;
    const mockContext = createMockContext({
      user_group_creation_objectives: [],
    });

    const result = createUserGroupNode(
      mockContext,
      entityType as IAMNodeEntity.User | IAMNodeEntity.Group,
      { label: mockLabel }
    );

    const createdNode = result.updatedContext.nodes.find(
      (n: IAMAnyNode) => entityType === n.data.entity
    );
    expect(createdNode).toBeDefined();
    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: true,
        entity: entityType,
        show_pulse_animation: false,
      },
    });
  });
});
