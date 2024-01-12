import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';
import Ajv from 'ajv';
import sampleSchema from 'schemas/sample-schema.json';

const ajv = new Ajv();
const validate = ajv.compile(sampleSchema);

export function lint(view: EditorView): Diagnostic[] {
  const doc = view.state.doc.toString();
  const diagnostics: Diagnostic[] = [];

  try {
    const parsedDoc = JSON.parse(doc);

    if (!validate(parsedDoc)) {
      validate.errors?.forEach(error => {
        console.log(error);
        console.log(error.instancePath.split('/').length);
        diagnostics.push({
          from: view.state.doc.line(error.instancePath.split('/').length).from,
          to: view.state.doc.line(error.instancePath.split('/').length).to,
          severity: 'error',
          message: error.message || 'sabri',
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
