import { describe, it, expect, vi } from 'vitest';

import {
  createPermissionPolicy,
  createUserGroupNode,
} from './nodes-creation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createEdge } from '@/factories/edge-factory';
import { createGroupNode } from '@/factories/group-node-factory';
import {
  createPolicyCreationObjective,
  createUserGroupCreationObjective,
} from '@/factories/objectives-factory';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { createUserNode } from '@/factories/user-node-factory';
import { CreatableIAMNodeEntity, IAMNodeEntity } from '@/types';
import { findAnyValidPolicy } from '@/utils/iam-code-linter';

vi.mock('@/factories/policy-node-factory', () => ({
  createPolicyNode: vi.fn(props => props),
}));

vi.mock('@/factories/group-node-factory', () => ({
  createGroupNode: vi.fn(props => props),
}));

vi.mock('@/factories/user-node-factory', () => ({
  createUserNode: vi.fn(props => props),
}));

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

    const mockPolicyNode = createPolicyNode({ content: mockDocString, label: mockLabel });
    const result = createPermissionPolicy(mockContext, mockDocString, mockLabel);

    expect(result.updatedContext.nodes).toContainEqual(expect.objectContaining(mockPolicyNode));
    expect(result.events).toEqual([]);
    expect(createPolicyNode).toHaveBeenCalledWith(
      expect.objectContaining({
        content: mockDocString,
        label: mockLabel,
        unnecessary_node: true,
      })
    );
  });

  it('creates a new policy node with a matching objective and adds it as necessary', () => {
    const policyNode = createPolicyNode({
      id: '1',
      data: { entity: IAMNodeEntity.Policy, granted_accesses: [] },
    });
    const userNode = createUserNode({ id: '2', data: { entity: IAMNodeEntity.User } });
    const initialEdge = createEdge({
      source: policyNode.id,
      target: userNode.id,
      data: {
        source_node_data: policyNode,
        target_node_data: userNode,
      },
    });

    mockContext = createMockContext({ nodes: [policyNode, userNode] });

    vi.mocked(findAnyValidPolicy).mockReturnValue(
      createPolicyCreationObjective({
        on_finish_event: 'MOCK_EVENT',
        initial_edges: [initialEdge],
      })
    );

    const mockPolicyNode = createPolicyNode({
      content: mockDocString,
      label: mockLabel,
    });

    const result = createPermissionPolicy(mockContext, mockDocString, mockLabel);

    expect(result.updatedContext.nodes).toContainEqual(expect.objectContaining(mockPolicyNode));
    expect(result.updatedContext.edges).toContainEqual(
      expect.objectContaining({ id: initialEdge.id })
    );

    expect(result.events).toEqual(['MOCK_EVENT']);
    expect(createPolicyNode).toHaveBeenCalledWith(
      expect.objectContaining({
        content: mockDocString,
        label: mockLabel,
        unnecessary_node: false,
      })
    );
  });
});

describe.each([
  ['User', IAMNodeEntity.User, createUserNode],
  ['Group', IAMNodeEntity.Group, createGroupNode],
])('createUserGroupNode (%s)', (_, entityType, createFn) => {
  it('creates node and returns event if valid objective is found', () => {
    const mockNode = createFn({ label: `mock_${entityType.toLowerCase()}` });
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
      mockNode
    );

    expect(result.updatedContext.nodes).toContainEqual(expect.objectContaining(mockNode));
    expect(result.events).toEqual([`${entityType}_CREATED`]);
  });

  it(`creates a new user or group node, updates the context,
      and returns no events when no valid objective is found`, () => {
    const mockNode = createFn({ label: `mock_${entityType.toLowerCase()}` });
    const mockContext = createMockContext({
      user_group_creation_objectives: [],
    });

    const result = createUserGroupNode(
      mockContext,
      entityType as IAMNodeEntity.User | IAMNodeEntity.Group,
      mockNode
    );

    expect(result.updatedContext.nodes).toContainEqual(expect.objectContaining(mockNode));
    expect(result.events).toEqual([]);
  });
});
