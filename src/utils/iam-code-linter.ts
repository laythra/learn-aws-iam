import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import Ajv, { ValidateFunction } from 'ajv';
import _ from 'lodash';

import {
  BaseFinishEventMap,
  IAMPolicyRoleCreationObjective,
  IAMRoleCreationObject,
} from '@/machines/types';
import iamPolicySchema from '@/schemas/aws-iam-policy-schema.json';
import iamRoleTurstPolicySchema from '@/schemas/aws-iam-role-trust-policy-schema.json';
import sharedConditionSchema from '@/schemas/shared-condition-schema.json';
import { IAMNodeEntity } from '@/types';

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

// TODO: This helper script surely shouldn't understand the context of policy/role objectives
// Move this elsewhere
export const findAnyValidPolicy = <TFinishEventMap extends BaseFinishEventMap>(
  policyRoleObjectives: IAMPolicyRoleCreationObjective<TFinishEventMap>[],
  docString: string
): IAMPolicyRoleCreationObjective<TFinishEventMap> | undefined => {
  policyRoleObjectives = _.orderBy(policyRoleObjectives, 'validate_inside_code_editor', 'desc');

  return policyRoleObjectives.find(policyRoleObjective =>
    isJSONValid(
      docString,
      policyRoleObjective.validate_function ?? GENERIC_VALIDATION_FNS[policyRoleObjective.entity]
    )
  );
};

// TODO: The feels like it doesn't belong here. Move it
export const findAnyValidRole = <TFinishEventMap extends BaseFinishEventMap>(
  roleObjectives: IAMRoleCreationObject<TFinishEventMap>[],
  docString: string,
  attachedPolicies: string[]
): IAMPolicyRoleCreationObjective<TFinishEventMap> | undefined => {
  roleObjectives = _.orderBy(roleObjectives, 'validate_inside_code_editor', 'desc');

  return roleObjectives.find(
    roleObjective =>
      isJSONValid(
        docString,
        roleObjective.validate_function ?? GENERIC_VALIDATION_FNS[IAMNodeEntity.Role]
      ) && roleObjective.required_policies.every(policy => attachedPolicies.includes(policy))
  );
};

export const getLintingErrors = (
  view: EditorView,
  validateFunction: ValidateFunction
): Diagnostic[] => {
  const lintingErrors = lint(view, {
    validateFunction: validateFunction,
  });

  return lintingErrors['syntax'].length > 0 ? lintingErrors['syntax'] : lintingErrors['logical'];
};
