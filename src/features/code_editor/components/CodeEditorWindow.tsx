import { useEffect, useRef, useState, forwardRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import _ from 'lodash';

import useSchemaValidator from '@/hooks/useSchemaValidator';
import sampleSchema from '@/schemas/sample-schema.json';
import { IAMScriptableEntitiesCreationObjective } from '@/types';
import { getLintingErrors } from '@/utils/iam-code-linter';

interface CodeEditorWindowProps {
  setContent: (content: string) => void;
  setErrors: (errors: Diagnostic[]) => void;
  content: string;
  setIsLinting: (isLinting: boolean) => void;
  targetObjective: IAMScriptableEntitiesCreationObjective | undefined;
}

export const CodeEditorWindow = forwardRef<ReactCodeMirrorRef, CodeEditorWindowProps>(
  ({ setContent, setErrors, content, setIsLinting, targetObjective }, ref) => {
    const [editorInitialized, setEditorInitialized] = useState<boolean>(false);
    const policySchema = targetObjective?.json_schema || sampleSchema;

    const policyValidator = useSchemaValidator(policySchema);
    const editorRef = useRef<EditorView>();

    const validateChange = _.debounce((): void => {
      if (editorRef.current) {
        const lintingErrors = getLintingErrors(
          editorRef.current,
          policyValidator,
          targetObjective?.description,
          targetObjective?.validate_inside_code_editor
        );

        setErrors(lintingErrors);
      }

      setIsLinting(false);
    }, 500);

    useEffect(() => {
      if (!editorRef.current) return;

      setErrors(getLintingErrors(editorRef.current, policyValidator, targetObjective?.description));
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
        extensions={[
          json(),
          linter(view => getLintingErrors(view, policyValidator, targetObjective?.description)),
        ]}
        onCreateEditor={handleEditorCreate}
        ref={ref}
      />
    );
  }
);

CodeEditorWindow.displayName = 'CodeEditorWindow';
