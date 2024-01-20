import { useRef, useState } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import _ from 'lodash';
import { lint } from 'utils/iam-policy-linter';

export const defaultRole = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'ec2.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
      },
    ],
  },
  null,
  2
);

interface CodeEditorProps {
  setErrors: React.Dispatch<React.SetStateAction<Diagnostic[]>>;
}

const RoleCodeEditor: React.FC<CodeEditorProps> = ({ setErrors }) => {
  const [code, setCode] = useState<string>(defaultRole);
  const editorRef = useRef<EditorView | undefined>();

  const handleChange = _.debounce((value: string): void => {
    setCode(value);

    if (editorRef.current) {
      setErrors(lint(editorRef.current, { iamEntity: 'role' }));
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

export default RoleCodeEditor;
