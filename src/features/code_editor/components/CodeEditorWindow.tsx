import { useEffect, useRef, useState, forwardRef, useMemo } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import Ajv from 'ajv';
import _ from 'lodash';

import iamPolicySchema from '@/schemas/aws-iam-policy-schema.json';
import iamRoleSchema from '@/schemas/aws-iam-role-schema.json';
import { IAMNodeEntity, IAMPolicyRoleCreationObjective, IAMScriptableEntity } from '@/types';
import { findAnyValidPolicy, getLintingErrors } from '@/utils/iam-code-linter';

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
const AJV_COMPILER = new Ajv();

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

    const [objectiveToValidate, objectivesWithValidators] = useMemo(() => {
      const fullObjectives = policyRoleObjectives.map(objective => {
        return {
          ...objective,
          validate_function: AJV_COMPILER.compile(objective.json_schema),
        };
      });

      const targetObjective = _.find(fullObjectives, 'validate_inside_code_editor');
      return [targetObjective, fullObjectives];
    }, [policyRoleObjectives]);

    const validateFunction = useMemo(() => {
      if (objectiveToValidate) {
        return objectiveToValidate.validate_function;
      } else {
        return selectedIAMEntity === IAMNodeEntity.Policy
          ? AJV_COMPILER.compile(iamPolicySchema)
          : AJV_COMPILER.compile(iamRoleSchema);
      }
    }, [objectivesWithValidators]);

    const editorRef = useRef<EditorView>();

    const getWarnings = (lintingErrors: Diagnostic[]): string[] => {
      if (!editorRef.current || lintingErrors.length > 0) {
        return [];
      }

      if (findAnyValidPolicy(objectivesWithValidators, editorRef.current)) {
        return [];
      }

      const warnings = [NO_MATCHING_POLICY_WARNING];

      if (objectiveToValidate) {
        warnings.push(`Our objective is to ${objectiveToValidate.description}`);
      }

      return warnings;
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
        extensions={[json(), linter(view => getLintingErrors(view, validateFunction))]}
        onCreateEditor={handleEditorCreate}
        ref={ref}
      />
    );
  }
);

CodeEditorWindow.displayName = 'CodeEditorWindow';
