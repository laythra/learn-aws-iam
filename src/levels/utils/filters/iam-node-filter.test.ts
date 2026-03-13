import { describe, it, expect, beforeEach } from 'vitest';

import { IAMNodeFilter } from './iam-node-filter';
import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { createRoleNode } from '@/domain/nodes/role-node-factory';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { IAMNodeEntity, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

describe('IAMIAMNodeFilter', () => {
  let mockNodes: IAMAnyNode[];

  beforeEach(() => {
    mockNodes = [
      // Users
      createUserNode({
        rootOverrides: { id: 'user-1' },
        dataOverrides: {
          id: 'user-1',
          label: 'Alice Smith',
          account_id: '123456789',
          tags: [
            ['Team', 'peach-team'],
            ['Environment', 'production'],
          ],
          unnecessary_node: false,
        },
      }),
      createUserNode({
        rootOverrides: { id: 'user-2' },
        dataOverrides: {
          id: 'user-2',
          label: 'Bob Johnson',
          account_id: '987654321',
          tags: [
            ['Team', 'bowser-power'],
            ['Environment', 'staging'],
          ],
          unnecessary_node: true,
        },
      }),

      // Policies
      createIdentityPolicyNode({
        rootOverrides: { id: 'policy-1' },
        dataOverrides: {
          id: 'policy-1',
          label: 'S3ReadPolicy',
          account_id: '123456789',
          tags: [['Owner', 'DevOps']],
          editable: true,
          content: '{"Version": "2012-10-17"}',
        },
      }),
      createIdentityPolicyNode({
        rootOverrides: { id: 'policy-2' },
        dataOverrides: {
          id: 'policy-2',
          label: 'EC2FullAccess',
          account_id: '123456789',
          tags: [],
          editable: false,
          content: '{"Version": "2012-10-17", "Statement": []}',
        },
      }),

      // Resources
      createResourceNode({
        rootOverrides: { id: 'resource-1' },
        dataOverrides: {
          id: 'resource-1',
          label: 'RDS Instance 1',
          account_id: '123456789',
          tags: [['Environment', 'production']],
          resource_type: IAMNodeResourceEntity.RDS,
        },
      }),
      createResourceNode({
        rootOverrides: { id: 'resource-2' },
        dataOverrides: {
          id: 'resource-2',
          label: 'S3 Bucket',
          account_id: '987654321',
          tags: [['Environment', 'staging']],
          resource_type: IAMNodeResourceEntity.S3Bucket,
        },
      }),

      // Group
      createGroupNode({
        rootOverrides: { id: 'group-1' },
        dataOverrides: {
          id: 'group-1',
          label: 'Developers',
          account_id: '123456789',
          tags: [['Team', 'development']],
          parent_id: 'org-1',
        },
      }),

      // Role
      createRoleNode({
        rootOverrides: { id: 'role-1' },
        dataOverrides: {
          id: 'role-1',
          label: 'AdminRole',
          account_id: '123456789',
          tags: [],
        },
      }),
    ] as IAMAnyNode[];
  });

  describe('Basic filtering', () => {
    it('should return all nodes when no filters applied', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).build();

      expect(result).toHaveLength(8);
      expect(result).toEqual(mockNodes);
    });

    it('should filter by entity type', () => {
      const users = IAMNodeFilter.create()
        .fromNodes(mockNodes)
        .whereEntityIs(IAMNodeEntity.User)
        .build();

      expect(users).toHaveLength(2);
      expect(users.every(node => node.data.entity === IAMNodeEntity.User)).toBe(true);
    });

    it('should filter by multiple entity types', () => {
      const usersAndPolicies = IAMNodeFilter.create()
        .fromNodes(mockNodes)
        .whereEntityIsOneOf(IAMNodeEntity.User, IAMNodeEntity.IdentityPolicy)
        .build();

      expect(usersAndPolicies).toHaveLength(4);
      expect(
        usersAndPolicies.every(node =>
          [IAMNodeEntity.User, IAMNodeEntity.IdentityPolicy].includes(node.data.entity)
        )
      ).toBe(true);
    });

    it('should filter by node ID', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIdIs('user-1').build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('user-1');
    });

    it('should filter by multiple node IDs', () => {
      const result = IAMNodeFilter.create()
        .fromNodes(mockNodes)
        .whereIdIsOneOf('user-1', 'policy-1', 'nonexistent')
        .build();

      expect(result).toHaveLength(2);
      expect(result.map(node => node.id)).toEqual(['user-1', 'policy-1']);
    });
  });

  describe('Tag filtering', () => {
    it('should filter by tag key only', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereHasTag('Team').build();

      expect(result).toHaveLength(3); // user-1, user-2, group-1
      expect(result.every(node => node.data.tags?.some(([key]) => key === 'Team'))).toBe(true);
    });

    it('should filter by tag key and value', () => {
      const result = IAMNodeFilter.create()
        .fromNodes(mockNodes)
        .whereHasTag('Team', 'peach-team')
        .build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('user-1');
    });

    it('should handle nodes with no tags', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereHasTag('NonExistent').build();

      expect(result).toHaveLength(0);
    });
  });

  describe('Policy-specific filtering', () => {
    it('should filter editable policies', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIsEditable().build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('policy-1');
    });

    it('should filter non-editable policies', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIsNotEditable().build();

      // Should include all non-policy nodes + non-editable policies
      expect(result).toHaveLength(7);
      expect(result.some(node => node.id === 'policy-2')).toBe(true);
      expect(result.some(node => node.id === 'user-1')).toBe(true);
    });
  });

  describe('Resource-specific filtering', () => {
    it('should filter by resource type', () => {
      const result = IAMNodeFilter.create()
        .fromNodes(mockNodes)
        .whereResourceTypeIs(IAMNodeResourceEntity.RDS)
        .build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('resource-1');
    });
  });

  describe('Necessity filtering', () => {
    it('should filter unnecessary nodes', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIsUnnecessary().build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('user-2');
    });

    it('should filter necessary nodes', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIsNecessary().build();

      expect(result).toHaveLength(7);
      expect(result.every(node => !node.data.unnecessary_node)).toBe(true);
    });
  });

  describe('Parent/hierarchy filtering', () => {
    it('should filter by parent ID', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereParentIs('org-1').build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('group-1');
    });

    it('should filter nodes with parent', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereHasParent().build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('group-1');
    });

    it('should filter root nodes', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIsRootNode().build();

      expect(result).toHaveLength(7);
      expect(
        result.every(node => node.data.parent_id === undefined || node.data.parent_id === null)
      ).toBe(true);
    });
  });

  describe('Complex filtering scenarios', () => {
    it('should handle editable policies in specific account', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIsEditable().build();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('policy-1');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty node array', () => {
      const result = IAMNodeFilter.create().fromNodes([]).whereEntityIs(IAMNodeEntity.User).build();

      expect(result).toHaveLength(0);
    });

    it('should handle filters that match nothing', () => {
      const result = IAMNodeFilter.create().fromNodes(mockNodes).whereIdIs('nonexistent').build();

      expect(result).toHaveLength(0);
    });

    it('should handle nodes with undefined/null tags', () => {
      const nodesWithNullTags = [createUserNode({ dataOverrides: { tags: undefined } })];
      const result = IAMNodeFilter.create().fromNodes(nodesWithNullTags).whereHasTag('Any').build();

      expect(result).toHaveLength(0);
    });
  });
});
