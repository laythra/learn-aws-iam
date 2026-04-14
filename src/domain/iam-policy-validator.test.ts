import { EditorState } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import type { ValidateFunction } from 'ajv';
import { describe, it, expect, vi } from 'vitest';

import {
  isJSONValid,
  findAnyValidObjective,
  getObjectiveValidationFunction,
  BASE_VALIDATION_FNS,
  AJV_COMPILER,
  collectValidationDiagnostics,
} from './iam-policy-validator';
import { IAMNodeEntity } from '@/types/iam-enums';
import { ObjectiveType } from '@/types/objective-types';
import type { BaseCreationObjective, BaseFinishEventMap } from '@/types/objective-types';

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

function makeView(text: string): EditorView {
  const state = EditorState.create({ doc: text });
  return { state } as unknown as EditorView;
}

function messages(diagnostics: ReturnType<typeof collectValidationDiagnostics>): string[] {
  return diagnostics.map(d => d.message);
}

describe('collectValidationDiagnostics — identity policy (base validator)', () => {
  const validateFn = BASE_VALIDATION_FNS[IAMNodeEntity.IdentityPolicy];

  it('returns no diagnostics for a fully valid policy', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Action: 's3:GetObject', Resource: '*' }],
        },
        null,
        2
      )
    );
    expect(collectValidationDiagnostics(view, validateFn)).toHaveLength(0);
  });

  it('accepts Resource as a single string ARN', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: 's3:GetObject',
              Resource: 'arn:aws:s3:::public-images/*',
            },
          ],
        },
        null,
        2
      )
    );
    expect(collectValidationDiagnostics(view, validateFn)).toHaveLength(0);
  });

  it('accepts Resource as an array of ARNs', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['s3:GetObject', 's3:PutObject'],
              Resource: ['arn:aws:s3:::bucket/*', 'arn:aws:s3:::other-bucket/*'],
            },
          ],
        },
        null,
        2
      )
    );
    expect(collectValidationDiagnostics(view, validateFn)).toHaveLength(0);
  });

  it('reports an invalid Sid pattern with a clear message', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'hahaha%$#',
              Effect: 'Allow',
              Action: 's3:GetObject',
              Resource: '*',
            },
          ],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, validateFn));
    expect(msgs.length).toBeGreaterThanOrEqual(1);
    expect(msgs.some(m => /Sid/.test(m) && /letters and numbers/.test(m))).toBe(true);
  });

  it('reports an invalid Effect value', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'ALLOW', Action: 's3:GetObject', Resource: '*' }],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, validateFn));
    expect(msgs.some(m => m.includes('Allow') && m.includes('Deny'))).toBe(true);
  });

  it('reports an unknown property on a statement', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: 's3:GetObject',
              Resource: '*',
              Typo: 'oops',
            },
          ],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, validateFn));
    expect(msgs.some(m => m.includes('Typo'))).toBe(true);
  });

  it('reports a missing required field (Effect)', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Action: 's3:GetObject', Resource: '*' }],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, validateFn));
    expect(msgs.some(m => m.includes('Effect'))).toBe(true);
  });

  it('includes the faulty field name in the diagnostic path', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Action: 's3:GetObject', Resource: 'not-an-arn' }],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, validateFn));
    // The diagnostic path should mention the field that failed (Resource)
    expect(msgs.some(m => m.includes('Resource'))).toBe(true);
  });

  it('returns a syntax error diagnostic for malformed JSON', () => {
    const view = makeView('{ "Version": "2012-10-17", ');
    const diags = collectValidationDiagnostics(view, validateFn);
    expect(diags).toHaveLength(1);
    expect(diags[0].message).toMatch(/Syntax Error/);
    expect(diags[0].severity).toBe('error');
  });

  it('does not duplicate diagnostics for the same path', () => {
    // Resource with a completely invalid type triggers multiple AJV sub-errors
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Action: 's3:GetObject', Resource: 123 }],
        },
        null,
        2
      )
    );
    const diags = collectValidationDiagnostics(view, validateFn);
    const resourceDiags = diags.filter(d => d.message.includes('Resource'));
    expect(resourceDiags.length).toBeLessThanOrEqual(1);
  });

  it('reports invalid string Resource as an ARN error, not "expected array"', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            { Effect: 'Allow', Action: 's3:GetObject', Resource: 'INSERT BUCKET ARN HERE' },
          ],
        },
        null,
        2
      )
    );
    const msgs = collectValidationDiagnostics(view, validateFn).map(d => d.message);
    expect(msgs.some(m => m.includes('expected array'))).toBe(false);
    expect(msgs.some(m => m.includes('valid ARN'))).toBe(true);
  });
});

describe('collectValidationDiagnostics — trust policy (base validator)', () => {
  const validateFn = BASE_VALIDATION_FNS[IAMNodeEntity.Role];

  it('returns no diagnostics for a valid trust policy', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' },
              Action: 'sts:AssumeRole',
            },
          ],
        },
        null,
        2
      )
    );
    expect(collectValidationDiagnostics(view, validateFn)).toHaveLength(0);
  });

  it('reports an invalid Service principal format', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { Service: 'not-a-service' },
              Action: 'sts:AssumeRole',
            },
          ],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, validateFn));
    expect(msgs.some(m => m.includes('Service'))).toBe(true);
  });
});

describe('collectValidationDiagnostics — custom objective validator', () => {
  it('shows structural messages (pattern) even on custom validators', () => {
    const customFn = AJV_COMPILER.compile({
      type: 'object',
      properties: {
        Version: { type: 'string', enum: ['2012-10-17'] },
        Statement: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              Sid: { type: 'string', pattern: '^[a-zA-Z0-9]*$' },
              Effect: { type: 'string', enum: ['Allow', 'Deny'] },
              Action: { type: 'string' },
              Resource: { type: 'string' },
            },
            required: ['Effect', 'Action', 'Resource'],
          },
        },
      },
      required: ['Version', 'Statement'],
    });

    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'bad sid!!',
              Effect: 'Allow',
              Action: 's3:GetObject',
              Resource: '*',
            },
          ],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, customFn));
    expect(msgs.some(m => m.includes('letters and numbers'))).toBe(true);
  });

  it('does not show "expected object" for Statement when field-level errors exist', () => {
    // The policy schema has a oneOf on Statement where branch 0 is a $ref to the Statement
    // object definition. With Statement:[{...}] (an array), branch 0 fires type:object at
    // /Statement — but that should be suppressed in favour of the concrete field errors.
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Action: [], Resource: [] }],
        },
        null,
        2
      )
    );
    const msgs = messages(
      collectValidationDiagnostics(view, BASE_VALIDATION_FNS[IAMNodeEntity.IdentityPolicy])
    );
    expect(msgs.every(m => !m.includes('expected object'))).toBe(true);
    expect(msgs.some(m => m.includes('must contain at least'))).toBe(true);
  });

  it('reports invalid action string as a field-level error, not a parent oneOf error', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Action: ['haha'], Resource: '*' }],
        },
        null,
        2
      )
    );
    const msgs = messages(
      collectValidationDiagnostics(view, BASE_VALIDATION_FNS[IAMNodeEntity.IdentityPolicy])
    );
    expect(msgs.some(m => m.includes('not a valid IAM action'))).toBe(true);
    expect(msgs.every(m => !m.includes("doesn't match any of the allowed formats"))).toBe(true);
  });

  it('reports empty Resource array as a field-level minItems error,\
     not a parent oneOf error', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Action: 's3:GetObject', Resource: [] }],
        },
        null,
        2
      )
    );
    const msgs = messages(
      collectValidationDiagnostics(view, BASE_VALIDATION_FNS[IAMNodeEntity.IdentityPolicy])
    );
    expect(msgs.some(m => m.includes('must contain at least'))).toBe(true);
    expect(msgs.every(m => !m.includes("doesn't match any of the allowed formats"))).toBe(true);
  });

  it('reports both invalid action and empty resource when both are wrong', () => {
    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Action: ['haha'], Resource: [] }],
        },
        null,
        2
      )
    );
    const msgs = messages(
      collectValidationDiagnostics(view, BASE_VALIDATION_FNS[IAMNodeEntity.IdentityPolicy])
    );
    expect(msgs.some(m => m.includes('not a valid IAM action'))).toBe(true);
    expect(msgs.some(m => m.includes('must contain at least'))).toBe(true);
    expect(msgs.every(m => !m.includes("doesn't match any of the allowed formats"))).toBe(true);
  });

  it('does not show "expected array" for a wrong-type\
     Resource on an inline oneOf objective schema', () => {
    const objectiveFn = AJV_COMPILER.compile({
      type: 'object',
      properties: {
        Version: { type: 'string', const: '2012-10-17' },
        Statement: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              Effect: { type: 'string', const: 'Allow' },
              Action: { type: 'array', items: { type: 'string', const: 's3:GetObject' } },
              Resource: {
                oneOf: [
                  { type: 'array', minItems: 1, items: { const: 'arn:aws:s3:::public-images/*' } },
                  { type: 'string', const: 'arn:aws:s3:::public-images/*' },
                ],
              },
            },
            required: ['Effect', 'Action', 'Resource'],
          },
        },
      },
      required: ['Version', 'Statement'],
    });

    const view = makeView(
      JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            { Effect: 'Allow', Action: ['s3:GetObject'], Resource: 'INSERT BUCKET ARN HERE' },
          ],
        },
        null,
        2
      )
    );
    const msgs = messages(collectValidationDiagnostics(view, objectiveFn));
    expect(msgs.every(m => !m.includes('expected array'))).toBe(true);
    expect(msgs.some(m => m.includes("objective's requirements"))).toBe(true);
  });
});
