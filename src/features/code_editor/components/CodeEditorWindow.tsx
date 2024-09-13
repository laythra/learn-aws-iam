import { useEffect, useRef, useState, forwardRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import _ from 'lodash';

import useSchemaValidator from '@/hooks/useSchemaValidator';
import sampleSchema from '@/schemas/sample-schema.json';
import { IAMPolicyRoleCreationObjective } from '@/types';
import { getLintingErrors } from '@/utils/iam-code-linter';

interface CodeEditorWindowProps {
  setContent: (content: string) => void;
  setErrors: (errors: Diagnostic[]) => void;
  setWarnings: (warnings: string[]) => void;
  content: string;
  setIsLinting: (isLinting: boolean) => void;
  targetObjective: IAMPolicyRoleCreationObjective | undefined;
  findTargetValidPolicy: () => IAMPolicyRoleCreationObjective | undefined;
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';

export const CodeEditorWindow = forwardRef<ReactCodeMirrorRef, CodeEditorWindowProps>(
  (
    {
      setContent,
      setErrors,
      setWarnings,
      content,
      setIsLinting,
      targetObjective,
      findTargetValidPolicy,
    },
    ref
  ) => {
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

        if (lintingErrors.length === 0 && !findTargetValidPolicy()) {
          setWarnings([NO_MATCHING_POLICY_WARNING]);
        } else {
          setWarnings([]);
        }
      }

      setIsLinting(false);
    }, 500);

    useEffect(() => {
      if (!editorRef.current) return;

      const lintingErrors = getLintingErrors(
        editorRef.current,
        policyValidator,
        targetObjective?.description
      );

      setErrors(lintingErrors);

      if (lintingErrors.length === 0 && !findTargetValidPolicy()) {
        setWarnings([NO_MATCHING_POLICY_WARNING]);
      } else {
        setWarnings([]);
      }
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
