import { describe, it, expect, vi, beforeEach } from 'vitest';

import { editPermissionPolicy } from './nodes-editing-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createEdge } from '@/domain/edge-factory';
import { isNodeOfEntity } from '@/domain/node-type-guards';
import { ValidateFunctions } from '@/levels/level4/level-runtime-fns';
import { INITIAL_IN_LEVEL_POLICY_NODES } from '@/levels/level4/nodes/identity-policy-nodes';
import { POLICY_EDIT_OBJECTIVES } from '@/levels/level4/objectives/policy-role-edit-objectives';
import { PolicyEditFinishEvent } from '@/levels/level4/types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '@/levels/level4/types/node-ids';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMNodeMap } from '@/types/iam-node-types';

vi.mock('@/runtime/functions-registry', () => ({
  GetLevelValidateFunctions: vi.fn(() => ValidateFunctions),
}));

vi.mock('@/levels/common-state-machine-setup', () => ({
  createStateMachineSetup: vi.fn(),
}));

const ALL_OBJECTIVES = POLICY_EDIT_OBJECTIVES.flat();

const VALID_DEVELOPER_POLICY = JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Scan', 'dynamodb:Query'],
      Resource: 'arn:aws:dynamodb:us-east-1:123456789012:table/customer-data',
    },
    {
      Effect: 'Allow',
      Action: ['s3:GetObject', 's3:PutObject'],
      Resource: 'arn:aws:s3:::timeshift-assets/*',
    },
  ],
});

function makeContext(
  overrides: Parameters<typeof createMockContext>[0] = {}
): ReturnType<typeof createMockContext> {
  return createMockContext({
    level_number: 4,
    nodes: INITIAL_IN_LEVEL_POLICY_NODES,
    policy_edit_objectives: ALL_OBJECTIVES.map(o => ({ ...o, finished: false })),
    ...overrides,
  });
}

describe('editPermissionPolicy — Level 4 integration (validator → policy edit objective)', () => {
  let context: ReturnType<typeof makeContext>;

  beforeEach(() => {
    context = makeContext();
  });

  describe('valid policy edit', () => {
    it('marks the objective as finished', () => {
      const { updatedContext } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      const objective = updatedContext.policy_edit_objectives.find(
        o => o.id === PolicyNodeID.DeveloperPolicy
      );
      expect(objective?.finished).toBe(true);
    });

    it('emits the DEVELOPER_POLICY_EDITED finish event', () => {
      const { events } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      expect(events).toContain(PolicyEditFinishEvent.DEVELOPER_POLICY_EDITED);
    });

    it('updates the node content to the new document', () => {
      const { updatedContext } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      const node = updatedContext.nodes.find(n => n.id === PolicyNodeID.DeveloperPolicy);
      expect(node?.data.content).toBe(VALID_DEVELOPER_POLICY);
    });

    it('sets editable to false on the node', () => {
      const { updatedContext } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      const node = updatedContext.nodes.find(n => n.id === PolicyNodeID.DeveloperPolicy);
      expect(node?.data.editable).toBe(false);
    });

    it('replaces granted_accesses with the objective resources_to_grant', () => {
      const { updatedContext } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      const node = updatedContext.nodes.find(
        (n): n is IAMNodeMap[IAMNodeEntity.IdentityPolicy] =>
          isNodeOfEntity(n, IAMNodeEntity.IdentityPolicy) && n.id === PolicyNodeID.DeveloperPolicy
      );
      const targetNodeIds = node?.data.granted_accesses.map(a => a.target_node);
      expect(targetNodeIds).toContain(ResourceNodeID.TimeshiftAssetsS3Bucket);
      expect(targetNodeIds).toContain(ResourceNodeID.CustomerDataDynamoTable);
    });

    it('does not mark other objectives as finished', () => {
      const { updatedContext } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      const otherFinished = updatedContext.policy_edit_objectives.filter(
        o => o.id !== PolicyNodeID.DeveloperPolicy && o.finished
      );
      expect(otherFinished).toHaveLength(0);
    });

    it('returns the updated node', () => {
      const { updatedNode } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      expect(updatedNode?.id).toBe(PolicyNodeID.DeveloperPolicy);
    });
  });

  describe('edgesToRefresh', () => {
    it('returns edges sourced from the edited node', () => {
      const existingEdge = createEdge({
        rootOverrides: {
          source: PolicyNodeID.DeveloperPolicy,
          target: 'user-1',
        },
      });
      const unrelatedEdge = createEdge({
        rootOverrides: { source: 'user-1', target: 'resource-1' },
      });

      context = makeContext({ edges: [existingEdge, unrelatedEdge] });
      const { edgesToRefresh } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      expect(edgesToRefresh.map(e => e.id)).toContain(existingEdge.id);
      expect(edgesToRefresh.map(e => e.id)).not.toContain(unrelatedEdge.id);
    });

    it('returns an empty array when the node has no outgoing edges', () => {
      const { edgesToRefresh } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      expect(edgesToRefresh).toHaveLength(0);
    });
  });

  describe('invalid / unrecognized policy', () => {
    it('returns the context unchanged', () => {
      const { updatedContext } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        JSON.stringify({ NotAPolicy: true })
      );

      expect(updatedContext).toBe(context);
    });

    it('returns no events', () => {
      const { events } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        JSON.stringify({ NotAPolicy: true })
      );

      expect(events).toHaveLength(0);
    });

    it('returns no edges to refresh', () => {
      const { edgesToRefresh } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        JSON.stringify({ NotAPolicy: true })
      );

      expect(edgesToRefresh).toHaveLength(0);
    });
  });

  describe('already-finished objective is skipped', () => {
    beforeEach(() => {
      context = makeContext({
        policy_edit_objectives: ALL_OBJECTIVES.map(o => ({
          ...o,
          finished: o.id === PolicyNodeID.DeveloperPolicy,
        })),
      });
    });

    it('returns the context unchanged when the objective is already finished', () => {
      const { events, updatedContext } = editPermissionPolicy(
        context,
        PolicyNodeID.DeveloperPolicy,
        VALID_DEVELOPER_POLICY
      );

      expect(events).toHaveLength(0);
      expect(updatedContext).toBe(context);
    });
  });

  describe('node with no matching edit objective', () => {
    it('returns the context unchanged', () => {
      const { events, updatedContext } = editPermissionPolicy(
        context,
        'node-with-no-objective',
        VALID_DEVELOPER_POLICY
      );

      expect(events).toHaveLength(0);
      expect(updatedContext).toBe(context);
    });
  });
});
