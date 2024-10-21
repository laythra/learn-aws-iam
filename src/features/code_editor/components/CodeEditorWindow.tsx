import { useEffect, useRef, useState, forwardRef, useMemo } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { ValidateFunction } from 'ajv';
import _ from 'lodash';

import { IAMPolicyRoleCreationObjective } from '@/machines/types';
import { IAMScriptableEntity } from '@/types';
import { findAnyValidPolicy, getLintingErrors, isObjectiveValid } from '@/utils/iam-code-linter';
import { GENERIC_VALIDATION_FNS } from '@/utils/iam-code-linter';

interface CodeEditorWindowProps {
  setContent: (content: string) => void;
  setErrors: (errors: Diagnostic[]) => void;
  setWarnings: (warnings: string[]) => void;
  setIsLinting: (isLinting: boolean) => void;
  content: string;
  policyRoleObjectives: IAMPolicyRoleCreationObjective[];
  selectedIAMEntity: IAMScriptableEntity;
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
      policyRoleObjectives,
      selectedIAMEntity,
    },
    ref
  ) => {
    const [editorInitialized, setEditorInitialized] = useState<boolean>(false);

    const objectiveToValidate = useMemo(() => {
      return _.find(policyRoleObjectives, 'validate_inside_code_editor');
    }, [policyRoleObjectives]);

    const validateFunction: ValidateFunction =
      objectiveToValidate?.validate_function ?? GENERIC_VALIDATION_FNS[selectedIAMEntity];

    const editorRef = useRef<EditorView>();

    const getWarnings = (lintingErrors: Diagnostic[]): string[] => {
      const warnings = [NO_MATCHING_POLICY_WARNING];
      if (!editorRef.current || lintingErrors.length > 0) {
        return [];
      }

      if (objectiveToValidate) {
        if (isObjectiveValid(objectiveToValidate, editorRef.current)) {
          return [];
        } else {
          return warnings;
        }
      } else if (!findAnyValidPolicy(policyRoleObjectives, editorRef.current)) {
        return warnings;
      } else {
        return [];
      }
    };

    const validateChange = _.debounce((): void => {
      if (editorRef.current) {
        const lintingErrors = getLintingErrors(editorRef.current, validateFunction);

        setErrors(lintingErrors);
        setWarnings(getWarnings(lintingErrors));
      }

      setIsLinting(false);
    }, 500);

    useEffect(() => {
      if (!editorRef.current) return;

      const lintingErrors = getLintingErrors(editorRef.current, validateFunction);

      setErrors(lintingErrors);
      setWarnings(getWarnings(lintingErrors));
    }, [editorInitialized]);

    const onCreateEditor = (editor: EditorView): void => {
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
        extensions={[json(), linter(view => getLintingErrors(view, validateFunction))]}
        onCreateEditor={onCreateEditor}
        ref={ref}
      />
    );
  }
);

CodeEditorWindow.displayName = 'CodeEditorWindow';
