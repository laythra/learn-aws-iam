import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';
import Ajv, { ValidateFunction } from 'ajv';
import _ from 'lodash';

import { IAMPolicyRoleCreationObjective } from '@/machines/types';
import iamPolicySchema from '@/schemas/aws-iam-policy-schema.json';
import iamRoleSchema from '@/schemas/aws-iam-role-schema.json';
import { IAMNodeEntity } from '@/types';

interface LintConfig {
  validateFunction: ValidateFunction;
  creationObjective?: string;
}

const AJV_COMPILER = new Ajv();

export const GENERIC_VALIDATION_FNS = {
  [IAMNodeEntity.Policy]: AJV_COMPILER.compile(iamPolicySchema),
  [IAMNodeEntity.Role]: AJV_COMPILER.compile(iamRoleSchema),
};

function lint(
  view: EditorView,
  { validateFunction }: LintConfig
): { [key in 'syntax' | 'logical']: Diagnostic[] } {
  const doc = view.state.doc.toString();
  const diagnostics: { [key in 'syntax' | 'logical']: Diagnostic[] } = { syntax: [], logical: [] };

  try {
    const parsedDoc = JSON.parse(doc);

    if (!validateFunction(parsedDoc)) {
      validateFunction.errors?.forEach(error => {
        diagnostics['logical'].push({
          from: view.state.doc.line(error.instancePath.split('/').length).from,
          to: view.state.doc.line(error.instancePath.split('/').length).to,
          severity: 'error',
          message: 'Invalid JSON',
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

const isJSONValid = (view: EditorView, validateFunction: ValidateFunction): boolean => {
  const errors = lint(view, { validateFunction });

  return errors['syntax'].length === 0 && errors['logical'].length === 0;
};

export const isObjectiveValid = (
  policyRoleObjective: IAMPolicyRoleCreationObjective,
  editorView: EditorView
): IAMPolicyRoleCreationObjective | undefined => {
  const valdiateFn =
    policyRoleObjective.validate_function ?? GENERIC_VALIDATION_FNS[policyRoleObjective.entity];

  return isJSONValid(editorView, valdiateFn) ? policyRoleObjective : undefined;
};

export const findAnyValidPolicy = (
  policyRoleObjectives: IAMPolicyRoleCreationObjective[],
  editorView: EditorView
): IAMPolicyRoleCreationObjective | undefined => {
  policyRoleObjectives = _.orderBy(policyRoleObjectives, 'validate_inside_code_editor', 'desc');

  return policyRoleObjectives.find(policyRoleObjective =>
    isObjectiveValid(policyRoleObjective, editorView)
  );
};

export const getLintingErrors = (
  view: EditorView,
  policyValidator: ValidateFunction
): Diagnostic[] => {
  const lintingErrors = lint(view, {
    validateFunction: policyValidator,
  });

  return lintingErrors['syntax'] || lintingErrors['logical'];
};
