import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';
import { ErrorObject, ValidateFunction } from 'ajv';

interface LintConfig {
  validateFunction: ValidateFunction;
  creationObjective: string | undefined;
}

// This function transforms the error message(s) to a more user-friendly format
function getCustomMessage(error: ErrorObject, creationObjective: string | undefined): string {
  if (creationObjective) {
    return `Your JSON does not meet the requirements. Our objective is to ${creationObjective}`;
  }

  return error.message || '';
}

export function lint(
  view: EditorView,
  { validateFunction, creationObjective }: LintConfig
): Diagnostic[] {
  const doc = view.state.doc.toString();
  const diagnostics: Diagnostic[] = [];

  try {
    const parsedDoc = JSON.parse(doc);

    if (!validateFunction(parsedDoc)) {
      validateFunction.errors?.forEach(error => {
        diagnostics.push({
          from: view.state.doc.line(error.instancePath.split('/').length).from,
          to: view.state.doc.line(error.instancePath.split('/').length).to,
          severity: 'error',
          message: getCustomMessage(error, creationObjective),
        });
      });
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      const line = e.message.match(/line (\d+)/)?.[1];
      const lineNumber = line ? parseInt(line) - 1 : 0;
      diagnostics.push({
        from: view.state.doc.line(lineNumber + 1).from,
        to: view.state.doc.line(lineNumber + 1).to,
        severity: 'error',
        message: `Syntax Error: ${e.message}`,
      });
    }
  }

  return diagnostics;
}
