import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createIAMNode, createUserGroupNode } from './nodes-creation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { USER_GROUP_CREATION_OBJECTIVES } from '@/levels/level1/objectives/user-group-creation-objectives';
import { UserNodeID } from '@/levels/level1/types/node-ids';
import { ValidateFunctions } from '@/levels/level3/level-runtime-fns';
import { POLICY_CREATION_OBJECTIVES } from '@/levels/level3/objectives/identity-policy-creation-objectives';
import { PolicyNodeID } from '@/levels/level3/types/node-ids';
import { IAMNodeEntity } from '@/types/iam-enums';

vi.mock('@/levels/utils/functions-registry', () => ({
  GetLevelValidateFunctions: vi.fn(() => ValidateFunctions),
}));

vi.mock('@/levels/common-state-machine-setup', () => ({
  createStateMachineSetup: vi.fn(),
}));

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

describe('createIAMNode', () => {
  let context: ReturnType<typeof makeContext>;

  beforeEach(() => {
    vi.clearAllMocks();
    context = makeContext();
  });

  describe('valid S3 read policy', () => {
    it('marks the S3ReadPolicy objective as finished', () => {
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

    it('assigns the objective-defined id to the created node', () => {
      const { createdNode } = createIAMNode(
        context,
        VALID_S3_READ_POLICY,
        'S3 Read',
        IAMNodeEntity.IdentityPolicy
      );

      expect(createdNode.id).toBe(PolicyNodeID.S3ReadPolicy);
    });

    it('does not mark any other objective as finished', () => {
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
    it('assigns the S3ReadWritePolicy id to the created node', () => {
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
    it('does not mark any objective as finished', () => {
      const { updatedContext } = createIAMNode(
        context,
        INVALID_POLICY,
        'Bad Policy',
        IAMNodeEntity.IdentityPolicy
      );

      const anyFinished = updatedContext.policy_creation_objectives.some(o => o.finished);
      expect(anyFinished).toBe(false);
    });
  });

  describe('already-finished objectives are skipped', () => {
    beforeEach(() => {
      context = makeContext({
        policy_creation_objectives: ALL_OBJECTIVES.map(o => ({
          ...o,
          finished: o.id === PolicyNodeID.S3ReadPolicy,
        })),
      });
    });

    it('does not re-match a finished S3ReadPolicy objective', () => {
      const { events, createdNode } = createIAMNode(
        context,
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
      const { events } = createIAMNode(context, VALID_S3_READ_POLICY, 'SCP?', IAMNodeEntity.SCP);

      expect(events).toEqual([]);
    });
  });
});

function makeLevel1Context(
  overrides: Parameters<typeof createMockContext>[0] = {}
): ReturnType<typeof createMockContext> {
  return createMockContext({
    level_number: 1,
    user_group_creation_objectives: USER_GROUP_CREATION_OBJECTIVES.map(o => ({
      ...o,
      finished: false,
    })),
    ...overrides,
  });
}

describe('createUserGroupNode', () => {
  let context: ReturnType<typeof makeLevel1Context>;

  beforeEach(() => {
    context = makeLevel1Context();
  });

  describe('User creation with matching objective', () => {
    it('assigns the objective-defined id to the created node', () => {
      const { createdNode } = createUserGroupNode(context, IAMNodeEntity.User, { label: 'Alice' });

      expect(createdNode.id).toBe(UserNodeID.FirstUser);
    });

    it('marks the objective as finished', () => {
      const { updatedContext } = createUserGroupNode(context, IAMNodeEntity.User, {
        label: 'Alice',
      });

      const objective = updatedContext.user_group_creation_objectives.find(
        o => o.entity_id === UserNodeID.FirstUser
      );
      expect(objective?.finished).toBe(true);
    });
  });

  describe('Group creation — no matching objective', () => {
    it('does not match a User objective when a Group node is created', () => {
      const { events, createdNode } = createUserGroupNode(context, IAMNodeEntity.Group, {
        label: 'devs',
      });

      expect(events).toHaveLength(0);
      expect(createdNode.data.unnecessary_node).toBe(true);
    });
  });
});
