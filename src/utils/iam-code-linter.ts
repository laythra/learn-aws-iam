import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';
import { ValidateFunction } from 'ajv';

interface LintConfig {
  validateFunction: ValidateFunction;
}

export function lint(view: EditorView, { validateFunction }: LintConfig): Diagnostic[] {
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
          message: error.message || '',
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
        message: e.message,
      });
    }
  }

  return diagnostics;
}
