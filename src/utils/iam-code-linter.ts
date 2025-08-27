import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import Ajv, { ValidateFunction } from 'ajv';
import _ from 'lodash';

import {
  AccountID,
  BaseCreationObjective,
  BaseFinishEventMap,
  IAMPolicyCreationObjective,
  IAMResourcePolicyCreationObjective,
  IAMRoleCreationObjective,
  IAMSCPCreationObjective,
} from '@/machines/types';
import iamPolicySchema from '@/schemas/aws-iam-policy-schema.json';
import iamRoleTurstPolicySchema from '@/schemas/aws-iam-role-trust-policy-schema.json';
import sharedConditionSchema from '@/schemas/shared-condition-schema.json';
import { IAMNodeEntity, IAMCodeDefinedEntity } from '@/types';
import { IAMAnyNode } from '@/types/iam-node-types';

interface LintConfig {
  validateFunction: ValidateFunction;
  creationObjective?: string;
}

export const AJV_COMPILER = new Ajv({
  schemas: [iamPolicySchema, iamRoleTurstPolicySchema, sharedConditionSchema],
});

export const GENERIC_VALIDATION_FNS = {
  [IAMNodeEntity.Policy]: AJV_COMPILER.compile(iamPolicySchema),
  [IAMNodeEntity.Role]: AJV_COMPILER.compile(iamRoleTurstPolicySchema),
  [IAMNodeEntity.SCP]: AJV_COMPILER.compile(iamPolicySchema),
  [IAMNodeEntity.ResourcePolicy]: AJV_COMPILER.compile(iamPolicySchema),
  [IAMNodeEntity.PermissionBoundary]: AJV_COMPILER.compile(iamPolicySchema),
};

export const getObjectiveValidationFunction = <TFinishEventMap extends BaseFinishEventMap>(
  objective: BaseCreationObjective<TFinishEventMap>,
  nodes: IAMAnyNode[]
): ValidateFunction => {
  return (
    objective.get_validate_function?.(nodes) ??
    objective.validate_function ??
    GENERIC_VALIDATION_FNS[objective.entity as IAMCodeDefinedEntity]
  );
};

function lint(
  view: EditorView,
  { validateFunction }: LintConfig
): { [key in 'syntax' | 'logical']: Diagnostic[] } {
  const doc = view.state.doc.toString();
  const diagnostics: { [key in 'syntax' | 'logical']: Diagnostic[] } = { syntax: [], logical: [] };

  try {
    const parsedDoc = JSON.parse(doc);
    validateFunction(parsedDoc);
    const errorsDetected = validateFunction.errors && validateFunction.errors.length > 0;

    if (errorsDetected) {
      validateFunction.errors?.forEach(error => {
        diagnostics['logical'].push({
          from: view.state.doc.line(error.instancePath.split('/').length).from,
          to: view.state.doc.line(error.instancePath.split('/').length).to,
          severity: 'error',
          message: 'Invalid IAM Policy / Role syntax',
        });
      });
    }
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
  [IAMNodeEntity.Policy]: IAMPolicyCreationObjective<BaseFinishEventMap>;
  [IAMNodeEntity.SCP]: IAMSCPCreationObjective<BaseFinishEventMap>;
  [IAMNodeEntity.Role]: IAMRoleCreationObjective<BaseFinishEventMap>;
  [IAMNodeEntity.ResourcePolicy]: IAMResourcePolicyCreationObjective<BaseFinishEventMap>;
};

type ObjectiveByEntity<E extends IAMNodeEntity> = E extends keyof ObjectiveEntityMap
  ? ObjectiveEntityMap[E]
  : BaseCreationObjective<BaseFinishEventMap>;

export function findAnyValidObjective<E extends IAMNodeEntity>(
  objectives: BaseCreationObjective<BaseFinishEventMap>[],
  nodes: IAMAnyNode[],
  docString: string,
  accountId?: AccountID,
  targetObjectiveEntity?: IAMNodeEntity
): ObjectiveByEntity<E> | undefined {
  const sorted = _.orderBy(objectives, 'validate_inside_code_editor', 'desc');

  return sorted.find(objective => {
    if (objective.finished) return false;
    if (targetObjectiveEntity && objective.entity !== targetObjectiveEntity) return false;

    const validAccount = !objective.account_id || objective.account_id === accountId;
    const validateFn = getObjectiveValidationFunction(objective, nodes);
    const isValidJSON = isJSONValid(docString, validateFn);

    return isValidJSON && validAccount;
  }) as ObjectiveByEntity<E>;
}

export const getLintingErrors = (
  view: EditorView,
  validateFunction: ValidateFunction
): Diagnostic[] => {
  const lintingErrors = lint(view, {
    validateFunction: validateFunction,
  });

  return lintingErrors['syntax'].length > 0 ? lintingErrors['syntax'] : lintingErrors['logical'];
};
