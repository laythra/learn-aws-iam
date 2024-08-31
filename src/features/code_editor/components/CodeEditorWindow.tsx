import { useEffect, useRef, useState } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import _ from 'lodash';

import useSchemaValidator from '@/hooks/useSchemaValidator';
import sampleSchema from '@/schemas/sample-schema.json';
import { IAMScriptableEntitiesCreationObjective } from '@/types';
import { lint } from '@/utils/iam-code-linter';

interface CodeEditorWindowProps {
  setContent: (content: string) => void;
  setErrors: (errors: Diagnostic[]) => void;
  content: string;
  setIsLinting: (isLinting: boolean) => void;
  targetObjective: IAMScriptableEntitiesCreationObjective | undefined;
}

export const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({
  setContent,
  setErrors,
  content,
  setIsLinting,
  targetObjective,
}) => {
  const [editorInitialized, setEditorInitialized] = useState<boolean>(false);
  const policySchema = targetObjective?.json_schema || sampleSchema;

  const policyValidator = useSchemaValidator(policySchema);
  const editorRef = useRef<EditorView>();

  const getLintingErrors = (view: EditorView): Diagnostic[] => {
    return lint(view, {
      validateFunction: policyValidator,
      creationObjective: targetObjective?.description,
    });
  };

  const validateChange = _.debounce((): void => {
    if (editorRef.current) {
      setErrors(getLintingErrors(editorRef.current));
    }

    setIsLinting(false);
  }, 500);

  useEffect(() => {
    if (!editorRef.current) return;
    setErrors(getLintingErrors(editorRef.current));
  }, [editorInitialized]);

  const handleEditorCreate = (editor: EditorView): void => {
    editorRef.current = editor;
    setEditorInitialized(true);
  };

  return (
    <CodeMirror
      value={content}
      onChange={newContent => {
        setIsLinting(true);
        setContent(newContent);
        validateChange();
      }}
      height='200px'
      extensions={[json(), linter(view => getLintingErrors(view))]}
      onCreateEditor={handleEditorCreate}
    />
  );
};
