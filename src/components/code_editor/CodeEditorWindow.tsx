import { useRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import _ from 'lodash';
import { IAMNodeEntity } from 'types';
import { lint } from 'utils/iam-code-linter';

interface CodeEditorWindowProps {
  entity: IAMNodeEntity.Policy | IAMNodeEntity.Role;
  setContent: (content: string) => void;
  setErrors: (errors: Diagnostic[]) => void;
  content: string;
}

const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({
  entity,
  setContent,
  setErrors,
  content,
}) => {
  const editorRef = useRef<EditorView | undefined>();

  const handleChange = _.debounce((value: string): void => {
    setContent(value);

    if (editorRef.current) {
      setErrors(lint(editorRef.current, { iamEntity: entity }));
    }
  }, 500);

  return (
    <CodeMirror
      value={content}
      onChange={handleChange}
      height='200px'
      extensions={[json(), linter(view => lint(view, { iamEntity: entity }))]}
      onCreateEditor={editor => (editorRef.current = editor)}
    />
  );
};

export default CodeEditorWindow;
