import type { Diagnostic } from '@codemirror/lint';
import type { EditorView } from '@codemirror/view';
import Ajv from 'ajv';
import type { ValidateFunction, ErrorObject } from 'ajv';
import { parseTree, findNodeAtLocation, type Node as JsonNode } from 'jsonc-parser';

import iamPolicySchema from '@/domain/policy-schemas/aws-iam-policy-schema.json';
import iamResourcePolicySchema from '@/domain/policy-schemas/aws-iam-resource-policy-schema.json';
import iamRoleTurstPolicySchema from '@/domain/policy-schemas/aws-iam-role-trust-policy-schema.json';
import sharedDefinitionsSchema from '@/domain/policy-schemas/aws-iam-shared-definitions-schema.json';
import { IAMNodeEntity, IAMCodeDefinedEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';
import {
  BaseCreationObjective,
  BaseFinishEventMap,
  IAMPermissionBoundaryCreationObjective,
  IAMIdentityPolicyCreationObjective,
  IAMResourcePolicyCreationObjective,
  IAMRoleCreationObjective,
  IAMSCPCreationObjective,
} from '@/types/objective-types';

interface ValidationConfig {
  validateFunction: ValidateFunction;
  isBaseValidator: boolean;
  creationObjective?: string;
}

// Keywords that, when found inside a oneOf/anyOf sub-branch, point to the specific rule
// the user violated in the branch that best matches their data (e.g. wrong action format,
// too many array items). `const` is excluded since the wildcard "*" branch always emits a
// const failure for any non-"*" value, making it noise.
const FIELD_CONSTRAINT_KEYWORDS = new Set([
  'pattern',
  'minItems',
  'maxItems',
  'uniqueItems',
  'enum',
  'minLength',
  'format',
]);

// Keywords that produce a detailed human-readable message rather than the generic fallback.
// Used only in buildDiagnosticMessage.
const DETAILED_MESSAGE_KEYWORDS = new Set([
  'required',
  'additionalProperties',
  'type',
  'const',
  'pattern',
  'minItems',
  'maxItems',
  'minLength',
  'maxLength',
  'minProperties',
  'maxProperties',
  'format',
]);

/**
 * Resolves an AJV instancePath (e.g. "/Statement/0/Effect") to a { from, to }
 * character range in the document using the jsonc-parser AST.
 * Falls back to the first/last character of the document if the path can't be resolved.
 */
function resolvePathToRange(doc: string, instancePath: string): { from: number; to: number } {
  const root = parseTree(doc);
  if (!root) return { from: 0, to: doc.length };

  if (!instancePath) return { from: root.offset, to: root.offset + root.length };

  const segments = instancePath
    .split('/')
    .filter(Boolean)
    .map(s => (/^\d+$/.test(s) ? parseInt(s) : s));

  const node: JsonNode | undefined = findNodeAtLocation(root, segments);
  if (!node) return { from: 0, to: doc.length };

  return { from: node.offset, to: node.offset + node.length };
}

function formatPath(instancePath: string): string {
  if (!instancePath) return 'Document';
  return instancePath
    .split('/')
    .filter(Boolean)
    .map(segment => (/^\d+$/.test(segment) ? `[${parseInt(segment) + 1}]` : segment))
    .join(' → ')
    .replace(/ → \[/g, '[');
}

function buildBaseValidatorMessage(
  instancePath: string,
  keyword: string,
  params: Record<string, unknown>,
  message: string | undefined
): string {
  const path = formatPath(instancePath);
  const field = instancePath.split('/').filter(Boolean).pop() ?? '';

  switch (keyword) {
    case 'required':
      return `${path}: missing required field "${params['missingProperty'] as string}"`;
    case 'additionalProperties':
      // eslint-disable-next-line max-len
      return `${path}: unknown property "${params['additionalProperty'] as string}" — check for typos`;
    case 'enum':
      if (field === 'Effect') return `${path}: must be "Allow" or "Deny"`;
      if (field === 'Version') return `${path}: must be "2012-10-17"`;
      return `${path}: value is not one of the allowed options`;
    case 'type':
      return `${path}: expected ${params['type'] as string}, got a different type`;
    case 'pattern':
      if (field === 'Sid')
        return `${path}: only letters and numbers are allowed (no spaces or special characters)`;
      if (field === 'Action' || instancePath.includes('/Action'))
        // eslint-disable-next-line max-len
        return `${path}: not a valid IAM action — expected format is "service:Action" (e.g. "s3:GetObject") or "*"`;
      if (field === 'Resource' || instancePath.includes('/Resource'))
        return `${path}: must be a valid ARN (e.g. arn:aws:s3:::bucket-name) or "*"`;
      if (field === 'Service')
        return `${path}: must be a valid AWS service endpoint (e.g. lambda.amazonaws.com)`;
      if (field === 'AWS' || instancePath.includes('/Principal'))
        return `${path}: must be a valid IAM principal ARN`;
      return `${path}: value has an invalid format`;
    case 'minItems':
      return `${path}: must contain at least ${params['limit'] as number} item(s)`;
    case 'minLength':
      return `${path}: value is too short`;
    case 'const':
      return `${path}: value is not allowed here`;
    case 'oneOf':
    case 'anyOf':
      return `${path}: value doesn't match any of the allowed formats`;
    default:
      return `${path}: ${message ?? 'invalid value'}`;
  }
}

// Condition errors leak answers, so we suppress the details and show a generic message instead.
function suppressConditionDetails(instancePath: string): string | null {
  const segments = instancePath.split('/').filter(Boolean);
  const condIdx = segments.indexOf('Condition');
  if (condIdx === -1) return null;

  const condPath = '/' + segments.slice(0, condIdx + 1).join('/');
  return `${formatPath(condPath)}: doesn't satisfy the objective's requirements`;
}

function buildDiagnosticMessage(
  instancePath: string,
  keyword: string,
  params: Record<string, unknown>,
  message: string | undefined,
  isBaseValidator: boolean
): string {
  if (!isBaseValidator) {
    const suppressed = suppressConditionDetails(instancePath);
    if (suppressed) return suppressed;
  }

  if (isBaseValidator || DETAILED_MESSAGE_KEYWORDS.has(keyword)) {
    return buildBaseValidatorMessage(instancePath, keyword, params, message);
  }

  return `${formatPath(instancePath)}: value doesn't satisfy the objective's requirements`;
}

export const AJV_COMPILER = new Ajv({
  schemas: [
    iamPolicySchema,
    iamResourcePolicySchema,
    iamRoleTurstPolicySchema,
    sharedDefinitionsSchema,
  ],
  allErrors: true,
});

export const BASE_VALIDATION_FNS = {
  [IAMNodeEntity.IdentityPolicy]: AJV_COMPILER.compile(iamPolicySchema),
  [IAMNodeEntity.Role]: AJV_COMPILER.compile(iamRoleTurstPolicySchema),
  [IAMNodeEntity.SCP]: AJV_COMPILER.compile(iamPolicySchema),
  [IAMNodeEntity.ResourcePolicy]: AJV_COMPILER.compile(iamResourcePolicySchema),
  [IAMNodeEntity.PermissionBoundary]: AJV_COMPILER.compile(iamPolicySchema),
};

export const getObjectiveValidationFunction = <TFinishEventMap extends BaseFinishEventMap>(
  objective: BaseCreationObjective<TFinishEventMap>,
  nodes: IAMAnyNode[],
  validateFunctions: Record<string, (nodes: IAMAnyNode[]) => ValidateFunction>
): ValidateFunction => {
  return validateFunctions[objective.id]
    ? validateFunctions[objective.id](nodes)
    : BASE_VALIDATION_FNS[objective.entity as IAMCodeDefinedEntity];
};

function validatePolicyDocument(
  view: EditorView,
  { validateFunction, isBaseValidator }: ValidationConfig
): { [key in 'syntax' | 'logical']: Diagnostic[] } {
  const doc = view.state.doc.toString();
  const diagnostics: { [key in 'syntax' | 'logical']: Diagnostic[] } = { syntax: [], logical: [] };

  try {
    const parsedDoc = JSON.parse(doc);
    validateFunction(parsedDoc);
    const errorsDetected = validateFunction.errors && validateFunction.errors.length > 0;
    if (!errorsDetected) return diagnostics;

    // AJV reports errors from every oneOf/anyOf branch simultaneously (allErrors:true).
    // We score each error and keep only the best one per instancePath.
    //
    //   4 — field constraint inside a branch (e.g. minItems from the array branch of Resource)
    //   3 — field constraint at top level
    //   2 — structural keyword at top level (required, type, const, …)
    //   0 — oneOf/anyOf parent — suppressed when any child error exists
    //  -1 — skip (structural keyword inside a branch is noise from the wrong branch)
    const branchSubError = /(oneOf|anyOf)\/\d+\//;
    const errorPriority = (error: ErrorObject): number => {
      if (error.keyword === 'oneOf' || error.keyword === 'anyOf') return 0;
      const isSub = branchSubError.test(error.schemaPath);
      if (FIELD_CONSTRAINT_KEYWORDS.has(error.keyword)) return isSub ? 4 : 3;
      if (DETAILED_MESSAGE_KEYWORDS.has(error.keyword)) return isSub ? -1 : 2;
      return -1;
    };

    // Keep the highest-priority error per instancePath.
    const bestByPath = new Map<string, ErrorObject>();
    for (const error of validateFunction.errors ?? []) {
      const p = errorPriority(error);
      if (p < 0) continue;

      const existing = bestByPath.get(error.instancePath);
      if (!existing || p > errorPriority(existing)) {
        bestByPath.set(error.instancePath, error);
      }
    }

    // Suppress vague parent errors when concrete child errors already exist:
    // - oneOf/anyOf parents are always suppressed when any child error exists
    // - type/const at top-level (priority 2) are suppressed when a specific (≥3) child
    //   exists
    bestByPath.forEach((error, path) => {
      const isVague = error.keyword === 'oneOf' || error.keyword === 'anyOf';
      const isTopLevelNoise = error.keyword === 'type' || error.keyword === 'const';

      if (!isVague && !isTopLevelNoise) return;

      const childEntries = [...bestByPath.entries()].filter(
        ([k]) => k !== path && k.startsWith(path + '/')
      );
      const hasAnyChild = childEntries.length > 0;
      const hasSpecificChild = childEntries.some(([, e]) => errorPriority(e) >= 3);

      const shouldSuppress = (isVague && hasAnyChild) || (isTopLevelNoise && hasSpecificChild);

      if (shouldSuppress) bestByPath.delete(path);
    });

    bestByPath.forEach(error => {
      const { from, to } = resolvePathToRange(doc, error.instancePath);
      diagnostics['logical'].push({
        from,
        to,
        severity: 'error',
        message: buildDiagnosticMessage(
          error.instancePath,
          error.keyword ?? '',
          (error.params ?? {}) as Record<string, unknown>,
          error.message,
          isBaseValidator
        ),
      });
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      const line = e.message.match(/line (\d+)/)?.[1];
      const lineNumber = line ? parseInt(line) - 1 : 0;
      diagnostics['syntax'].push({
        from: view.state.doc.line(lineNumber + 1).from,
        to: view.state.doc.line(lineNumber + 1).to,
        severity: 'error',
        message: `Syntax Error: ${e.message}`,
      });
    }
  }

  return diagnostics;
}

export const isJSONValid = (docString: string, validateFunction: ValidateFunction): boolean => {
  try {
    const parsedDoc = JSON.parse(docString);
    return validateFunction(parsedDoc);
  } catch {
    return false;
  }
};

type ObjectiveEntityMap = {
  [IAMNodeEntity.IdentityPolicy]: IAMIdentityPolicyCreationObjective<BaseFinishEventMap>;
  [IAMNodeEntity.SCP]: IAMSCPCreationObjective<BaseFinishEventMap>;
  [IAMNodeEntity.Role]: IAMRoleCreationObjective<BaseFinishEventMap>;
  [IAMNodeEntity.ResourcePolicy]: IAMResourcePolicyCreationObjective<BaseFinishEventMap>;
  [IAMNodeEntity.PermissionBoundary]: IAMPermissionBoundaryCreationObjective<BaseFinishEventMap>;
};

type ObjectiveByEntity<E extends IAMNodeEntity> = E extends keyof ObjectiveEntityMap
  ? ObjectiveEntityMap[E]
  : BaseCreationObjective<BaseFinishEventMap>;

export function findAnyValidObjective<E extends IAMNodeEntity>(
  objectives: BaseCreationObjective<BaseFinishEventMap>[],
  validateFunctions: Record<string, (nodes: IAMAnyNode[]) => ValidateFunction>,
  nodes: IAMAnyNode[],
  docString: string,
  accountId?: string,
  targetObjectiveEntity?: IAMNodeEntity
): ObjectiveByEntity<E> | undefined {
  return objectives.find(objective => {
    if (objective.finished) return false;
    if (targetObjectiveEntity && objective.entity !== targetObjectiveEntity) return false;

    const validAccount = !objective.account_id || objective.account_id === accountId;
    const validateFn = getObjectiveValidationFunction(objective, nodes, validateFunctions);
    const isValidJSON = isJSONValid(docString, validateFn);

    return isValidJSON && validAccount;
  }) as ObjectiveByEntity<E>;
}

export const collectValidationDiagnostics = (
  view: EditorView,
  validateFunction: ValidateFunction
): Diagnostic[] => {
  const isBaseValidator = (Object.values(BASE_VALIDATION_FNS) as ValidateFunction[]).includes(
    validateFunction
  );
  const validationErrors = validatePolicyDocument(view, {
    validateFunction,
    isBaseValidator,
  });

  return validationErrors['syntax'].length > 0
    ? validationErrors['syntax']
    : validationErrors['logical'];
};
