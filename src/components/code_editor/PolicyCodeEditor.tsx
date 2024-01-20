import { useRef, useState } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { defaultPolicy } from 'components/code_editor/code-editor-constants';
import _ from 'lodash';
import { lint } from 'utils/iam-policy-linter';

interface CodeEditorProps {
  setErrors: React.Dispatch<React.SetStateAction<Diagnostic[]>>;
}

const PolicyCodeEditor: React.FC<CodeEditorProps> = ({ setErrors }) => {
  const [code, setCode] = useState<string>(defaultPolicy);
  const editorRef = useRef<EditorView | undefined>();

  const handleChange = _.debounce((value: string): void => {
    setCode(value);

    if (editorRef.current) {
      setErrors(lint(editorRef.current, { iamEntity: 'policy' }));
    }
  }, 500);

  return (
    <CodeMirror
      value={code}
      onChange={handleChange}
      height='200px'
      extensions={[json(), linter(view => lint(view, { iamEntity: 'policy' }))]}
      onCreateEditor={editor => (editorRef.current = editor)}
    />
  );
};

export default PolicyCodeEditor;
