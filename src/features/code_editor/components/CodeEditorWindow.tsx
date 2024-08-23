import { useEffect, useRef, useState } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import _ from 'lodash';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import useSchemaValidator from '@/hooks/useSchemaValidator';
import defaultPolicySchema from '@/schemas/aws-iam-poilcy-schema.json';
import { lint } from '@/utils/iam-code-linter';

interface CodeEditorWindowProps {
  setContent: (content: string) => void;
  setErrors: (errors: Diagnostic[]) => void;
  content: string;
  setIsLinting: (isLinting: boolean) => void;
}

export const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({
  setContent,
  setErrors,
  content,
  setIsLinting,
}) => {
  const [editorInitialized, setEditorInitialized] = useState<boolean>(false);

  const policySchema = LevelsProgressionContext.useSelector(
    state => state.context.policy_schema ?? defaultPolicySchema
  );

  const policyValidator = useSchemaValidator(policySchema);
  const editorRef = useRef<EditorView>();

  const handleChange = _.debounce((value: string): void => {
    setContent(value);

    if (editorRef.current) {
      setErrors(lint(editorRef.current, { validateFunction: policyValidator }));
    }

    setIsLinting(false);
  }, 500);

  useEffect(() => {
    if (!editorRef.current) return;

    setErrors(lint(editorRef.current, { validateFunction: policyValidator }));
  }, [editorInitialized]);

  const handleEditorCreate = (editor: EditorView): void => {
    editorRef.current = editor;
    setEditorInitialized(true);
  };

  return (
    <CodeMirror
      value={content}
      onChange={() => {
        setIsLinting(true);
        handleChange(content);
      }}
      height='200px'
      extensions={[json(), linter(view => lint(view, { validateFunction: policyValidator }))]}
      onCreateEditor={handleEditorCreate}
    />
  );
};
