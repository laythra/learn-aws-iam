import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createIAMNode } from './nodes-creation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { ValidateFunctions } from '@/levels/level3/level-runtime-fns';
import { POLICY_CREATION_OBJECTIVES } from '@/levels/level3/objectives/policy-role-creation-objectives';
import { NodeCreationFinishEvent } from '@/levels/level3/types/finish-event-enums';
import { PolicyNodeID } from '@/levels/level3/types/node-ids';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

vi.mock('@/levels/functions-registry', () => ({
  GetLevelValidateFunctions: vi.fn(() => ValidateFunctions),
}));

vi.mock('@/levels/common-state-machine-setup', () => ({
  createStateMachineSetup: vi.fn(),
}));

// Valid policy documents matching each Level 3 schema exactly
const VALID_S3_READ_POLICY = JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    { Effect: 'Allow', Action: ['s3:GetObject'], Resource: 'arn:aws:s3:::public-images/*' },
  ],
});

const VALID_S3_READ_WRITE_POLICY = JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: ['s3:GetObject', 's3:PutObject'],
      Resource: 'arn:aws:s3:::public-assets/*',
    },
  ],
});

const INVALID_POLICY = JSON.stringify({ NotAPolicy: true });

// Level 3 objectives are nested arrays (one per "wave") — flatten them
const ALL_OBJECTIVES = POLICY_CREATION_OBJECTIVES.flat();

function makeContext(
  overrides: Parameters<typeof createMockContext>[0] = {}
): ReturnType<typeof createMockContext> {
  return createMockContext({
    level_number: 3,
    policy_creation_objectives: ALL_OBJECTIVES.map(o => ({ ...o, finished: false })),
    ...overrides,
  });
}

describe('createIAMNode — Level 3 integration (policy validator → objective matching)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('valid S3 read policy', () => {
    it('marks the S3ReadPolicy objective as finished', () => {
      const context = makeContext();
      const { updatedContext } = createIAMNode(
        context,
        VALID_S3_READ_POLICY,
        'S3 Read',
        IAMNodeEntity.IdentityPolicy
      );

      const objective = updatedContext.policy_creation_objectives.find(
        o => o.id === PolicyNodeID.S3ReadPolicy
      );
      expect(objective?.finished).toBe(true);
    });

    it('emits the S3_READ_POLICY_CREATED finish event', () => {
      const context = makeContext();
      const { events } = createIAMNode(
        context,
        VALID_S3_READ_POLICY,
        'S3 Read',
        IAMNodeEntity.IdentityPolicy
      );

      expect(events).toEqual([NodeCreationFinishEvent.S3_READ_POLICY_CREATED]);
    });

    it('creates the node with unnecessary_node = false and the correct id', () => {
      const context = makeContext();
      const { createdNode } = createIAMNode(
        context,
        VALID_S3_READ_POLICY,
        'S3 Read',
        IAMNodeEntity.IdentityPolicy
      );

      expect(createdNode.id).toBe(PolicyNodeID.S3ReadPolicy);
      expect(createdNode.data.unnecessary_node).toBe(false);
    });

    it('does not mark any other objective as finished', () => {
      const context = makeContext();
      const { updatedContext } = createIAMNode(
        context,
        VALID_S3_READ_POLICY,
        'S3 Read',
        IAMNodeEntity.IdentityPolicy
      );

      const otherFinished = updatedContext.policy_creation_objectives.filter(
        o => o.id !== PolicyNodeID.S3ReadPolicy && o.finished
      );
      expect(otherFinished).toHaveLength(0);
    });
  });

  describe('valid S3 read-write policy', () => {
    it('emits the S3_READ_WRITE_POLICY_CREATED finish event', () => {
      const context = makeContext();
      const { events } = createIAMNode(
        context,
        VALID_S3_READ_WRITE_POLICY,
        'S3 ReadWrite',
        IAMNodeEntity.IdentityPolicy
      );

      expect(events).toEqual([NodeCreationFinishEvent.S3_READ_WRITE_POLICY_CREATED]);
    });

    it('creates the node with the S3ReadWritePolicy id', () => {
      const context = makeContext();
      const { createdNode } = createIAMNode(
        context,
        VALID_S3_READ_WRITE_POLICY,
        'S3 ReadWrite',
        IAMNodeEntity.IdentityPolicy
      );

      expect(createdNode.id).toBe(PolicyNodeID.S3ReadWritePolicy);
    });
  });

  describe('invalid / unrecognized policy', () => {
    it('returns no events', () => {
      const context = makeContext();
      const { events } = createIAMNode(
        context,
        INVALID_POLICY,
        'Bad Policy',
        IAMNodeEntity.IdentityPolicy
      );

      expect(events).toEqual([]);
    });

    it('creates node with unnecessary_node = true', () => {
      const context = makeContext();
      const { createdNode } = createIAMNode(
        context,
        INVALID_POLICY,
        'Bad Policy',
        IAMNodeEntity.IdentityPolicy
      );

      expect(createdNode.data.unnecessary_node).toBe(true);
    });

    it('does not mark any objective as finished', () => {
      const context = makeContext();
      const { updatedContext } = createIAMNode(
        context,
        INVALID_POLICY,
        'Bad Policy',
        IAMNodeEntity.IdentityPolicy
      );

      const anyFinished = updatedContext.policy_creation_objectives.some(o => o.finished);
      expect(anyFinished).toBe(false);
    });

    it('adds the unnecessary node to context.nodes', () => {
      const context = makeContext();
      const { updatedContext } = createIAMNode(
        context,
        INVALID_POLICY,
        'Bad Policy',
        IAMNodeEntity.IdentityPolicy
      );

      const node = updatedContext.nodes.find(
        (n: IAMAnyNode) => n.data.entity === IAMNodeEntity.IdentityPolicy
      );
      expect(node).toBeDefined();
    });
  });

  describe('already-finished objectives are skipped', () => {
    it('does not re-match a finished S3ReadPolicy objective', () => {
      const contextWithFinished = makeContext({
        policy_creation_objectives: ALL_OBJECTIVES.map(o => ({
          ...o,
          finished: o.id === PolicyNodeID.S3ReadPolicy,
        })),
      });

      const { events, createdNode } = createIAMNode(
        contextWithFinished,
        VALID_S3_READ_POLICY,
        'S3 Read Again',
        IAMNodeEntity.IdentityPolicy
      );

      expect(events).toEqual([]);
      expect(createdNode.data.unnecessary_node).toBe(true);
    });
  });

  describe('wrong entity type is ignored', () => {
    it('does not match an IdentityPolicy objective when SCP entity is submitted', () => {
      const context = makeContext();
      const { events } = createIAMNode(context, VALID_S3_READ_POLICY, 'SCP?', IAMNodeEntity.SCP);

      expect(events).toEqual([]);
    });
  });
});
