import { describe, it, expect, vi } from 'vitest';

import {
  createPermissionPolicy,
  createUserGroupNode,
} from './nodes-creation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import {
  createPolicyCreationObjective,
  createUserGroupCreationObjective,
} from '@/factories/objectives-factory';
import { CreatableIAMNodeEntity, IAMNodeEntity } from '@/types';
import { findAnyValidPolicy } from '@/utils/iam-code-linter';

vi.mock('@/utils/iam-code-linter', () => ({
  findAnyValidPolicy: vi.fn(),
}));

vi.mock('@/machines/common-state-machine-setup', () => ({
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

  it('creates a new policy node without a matching objective and adds it as unnecessary', () => {
    vi.mocked(findAnyValidPolicy).mockReturnValue(undefined);

    const result = createPermissionPolicy(mockContext, mockDocString, mockLabel);

    const createdNode = result.updatedContext.nodes.find(
      n => n.data.entity === IAMNodeEntity.Policy
    );
    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: true,
        entity: IAMNodeEntity.Policy,
        granted_accesses: [],
      },
    });

    expect(result.events).toEqual([]);
  });

  it('creates a new policy node with a matching objective and marks it as necessary', () => {
    mockContext = createMockContext({});

    vi.mocked(findAnyValidPolicy).mockReturnValue(
      createPolicyCreationObjective({
        on_finish_event: 'MOCK_EVENT',
        initial_edges: [],
      })
    );

    const result = createPermissionPolicy(mockContext, mockDocString, mockLabel);
    const createdNode = result.updatedContext.nodes.find(
      n => n.data.entity === IAMNodeEntity.Policy
    );

    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: false,
        entity: IAMNodeEntity.Policy,
        granted_accesses: [],
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
    const mockObjective = createUserGroupCreationObjective({
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

    const createdNode = result.updatedContext.nodes.find(n => entityType === n.data.entity);
    expect(createdNode).toBeDefined();
    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: false,
        entity: entityType,
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

    const createdNode = result.updatedContext.nodes.find(n => entityType === n.data.entity);
    expect(createdNode).toBeDefined();
    expect(createdNode).toMatchObject({
      data: {
        label: mockLabel,
        unnecessary_node: true,
        entity: entityType,
      },
    });
  });
});
