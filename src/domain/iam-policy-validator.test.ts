import type { ValidateFunction } from 'ajv';
import { describe, it, expect, vi } from 'vitest';

import {
  isJSONValid,
  findAnyValidObjective,
  getObjectiveValidationFunction,
  BASE_VALIDATION_FNS,
  AJV_COMPILER,
} from './iam-policy-validator';
import { ObjectiveType } from '@/levels/types/objective-types';
import type { BaseCreationObjective, BaseFinishEventMap } from '@/levels/types/objective-types';
import { IAMNodeEntity } from '@/types/iam-enums';

const VALID_IDENTITY_POLICY = JSON.stringify({
  Version: '2012-10-17',
  Statement: [{ Effect: 'Allow', Action: 's3:GetObject', Resource: '*' }],
});

const VALID_TRUST_POLICY = JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: { Service: 'lambda.amazonaws.com' },
      Action: 'sts:AssumeRole',
    },
  ],
});

const INVALID_POLICY = JSON.stringify({ NotAPolicy: true });
const MALFORMED_JSON = '{ "Version": "2012-10-17", ';

const makeObjective = (
  overrides: Partial<BaseCreationObjective<BaseFinishEventMap>> = {}
): BaseCreationObjective<BaseFinishEventMap> => ({
  id: 'obj-1',
  entity: IAMNodeEntity.IdentityPolicy,
  type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
  initial_code: {},
  on_finish_event: 'FINISH' as BaseFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE],
  finished: false,
  extra_data: {},
  ...overrides,
});

describe('isJSONValid', () => {
  const validateFn = BASE_VALIDATION_FNS[IAMNodeEntity.IdentityPolicy];

  it('returns true for a valid identity policy', () => {
    expect(isJSONValid(VALID_IDENTITY_POLICY, validateFn)).toBe(true);
  });

  it('returns false for a policy missing required fields', () => {
    expect(isJSONValid(INVALID_POLICY, validateFn)).toBe(false);
  });

  it('returns false for malformed JSON', () => {
    expect(isJSONValid(MALFORMED_JSON, validateFn)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isJSONValid('', validateFn)).toBe(false);
  });

  it('validates a trust policy with the role validate function', () => {
    const roleFn = BASE_VALIDATION_FNS[IAMNodeEntity.Role];
    expect(isJSONValid(VALID_TRUST_POLICY, roleFn)).toBe(true);
  });

  it('rejects an identity policy document against the role trust policy schema', () => {
    const roleFn = BASE_VALIDATION_FNS[IAMNodeEntity.Role];
    expect(isJSONValid(VALID_IDENTITY_POLICY, roleFn)).toBe(false);
  });
});

describe('getObjectiveValidationFunction', () => {
  it('returns the base validation function when no custom fn is registered', () => {
    const objective = makeObjective({ id: 'obj-1', entity: IAMNodeEntity.IdentityPolicy });
    const fn = getObjectiveValidationFunction(objective, [], {});
    expect(fn).toBe(BASE_VALIDATION_FNS[IAMNodeEntity.IdentityPolicy]);
  });

  it('returns the custom function when one is registered for the objective id', () => {
    const customFn = vi.fn() as unknown as ValidateFunction;
    const validateFunctions = { 'obj-1': () => customFn };
    const objective = makeObjective({ id: 'obj-1' });
    const fn = getObjectiveValidationFunction(objective, [], validateFunctions);
    expect(fn).toBe(customFn);
  });

  it('falls back to generic function when no custom fn matches the id', () => {
    const customFn = vi.fn() as unknown as ValidateFunction;
    const validateFunctions = { 'other-obj': () => customFn };
    const objective = makeObjective({ id: 'obj-1', entity: IAMNodeEntity.SCP });
    const fn = getObjectiveValidationFunction(objective, [], validateFunctions);
    expect(fn).toBe(BASE_VALIDATION_FNS[IAMNodeEntity.SCP]);
  });
});

describe('findAnyValidObjective', () => {
  it('returns the first unfinished objective that matches the document', () => {
    const objectives = [makeObjective({ id: 'obj-1' })];
    const result = findAnyValidObjective(objectives, {}, [], VALID_IDENTITY_POLICY);
    expect(result?.id).toBe('obj-1');
  });

  it('skips objectives that are already finished', () => {
    const objectives = [
      makeObjective({ id: 'obj-1', finished: true }),
      makeObjective({ id: 'obj-2', finished: false }),
    ];
    const result = findAnyValidObjective(objectives, {}, [], VALID_IDENTITY_POLICY);
    expect(result?.id).toBe('obj-2');
  });

  it('returns undefined when the document is invalid against all objectives', () => {
    const objectives = [makeObjective({ id: 'obj-1' })];
    const result = findAnyValidObjective(objectives, {}, [], INVALID_POLICY);
    expect(result).toBeUndefined();
  });

  it('returns undefined when all objectives are finished', () => {
    const objectives = [makeObjective({ id: 'obj-1', finished: true })];
    const result = findAnyValidObjective(objectives, {}, [], VALID_IDENTITY_POLICY);
    expect(result).toBeUndefined();
  });

  it('returns undefined for an empty objectives list', () => {
    const result = findAnyValidObjective([], {}, [], VALID_IDENTITY_POLICY);
    expect(result).toBeUndefined();
  });

  it('matches only the objective with the correct account_id', () => {
    const objectives = [
      makeObjective({ id: 'obj-1', account_id: '111111111111' }),
      makeObjective({ id: 'obj-2', account_id: '999999999999' }),
    ];
    const result = findAnyValidObjective(objectives, {}, [], VALID_IDENTITY_POLICY, '111111111111');
    expect(result?.id).toBe('obj-1');
  });

  it('skips objectives whose account_id does not match', () => {
    const objectives = [makeObjective({ id: 'obj-1', account_id: '111111111111' })];
    const result = findAnyValidObjective(objectives, {}, [], VALID_IDENTITY_POLICY, '999999999999');
    expect(result).toBeUndefined();
  });

  it('matches when no account_id restriction is set on the objective', () => {
    const objectives = [makeObjective({ id: 'obj-1', account_id: undefined })];
    const result = findAnyValidObjective(objectives, {}, [], VALID_IDENTITY_POLICY, 'any-account');
    expect(result?.id).toBe('obj-1');
  });

  it('filters by targetObjectiveEntity when provided', () => {
    const objectives = [
      makeObjective({ id: 'obj-policy', entity: IAMNodeEntity.IdentityPolicy }),
      makeObjective({ id: 'obj-scp', entity: IAMNodeEntity.SCP }),
    ];
    const result = findAnyValidObjective(
      objectives,
      {},
      [],
      VALID_IDENTITY_POLICY,
      undefined,
      IAMNodeEntity.IdentityPolicy
    );
    expect(result?.id).toBe('obj-policy');
  });

  it('returns undefined when targetObjectiveEntity filters out all objectives', () => {
    const objectives = [makeObjective({ id: 'obj-1', entity: IAMNodeEntity.IdentityPolicy })];
    const result = findAnyValidObjective(
      objectives,
      {},
      [],
      VALID_IDENTITY_POLICY,
      undefined,
      IAMNodeEntity.SCP
    );
    expect(result).toBeUndefined();
  });

  it('uses a custom validate function when registered', () => {
    const alwaysValidFn = AJV_COMPILER.compile({ type: 'object' });
    const validateFunctions = { 'obj-custom': () => alwaysValidFn };
    const objectives = [makeObjective({ id: 'obj-custom' })];
    const result = findAnyValidObjective(objectives, validateFunctions, [], INVALID_POLICY);
    expect(result?.id).toBe('obj-custom');
  });
});
