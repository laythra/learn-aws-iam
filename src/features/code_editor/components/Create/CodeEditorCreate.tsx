import { useEffect, useRef, forwardRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import { findAnyValidPolicy, getLintingErrors, isJSONValid } from '@/utils/iam-code-linter';
import { GENERIC_VALIDATION_FNS } from '@/utils/iam-code-linter';

interface CodeEditorCreateProps {
  nodeId: string;
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';

export const CodeEditorCreate = forwardRef<ReactCodeMirrorRef, CodeEditorCreateProps>(
  ({ nodeId }, ref) => {
    const policyRoleObjectives = LevelsProgressionContext.useSelector(
      state => state.context.policy_role_objectives
    );
    const { selectedIAMEntity, content, isCodeEditorInitialized } = useSelector(
      codeEditorStateStore,
      state => _.pick(state.context, ['selectedIAMEntity', 'content', 'isCodeEditorInitialized']),
      _.isEqual
    );

    const objectiveToValidate = _.find(policyRoleObjectives, 'validate_inside_code_editor');
    const validateFunction =
      objectiveToValidate?.validate_function ?? GENERIC_VALIDATION_FNS[selectedIAMEntity];

    const editorRef = useRef<EditorView>();

    const getWarnings = (): string[] => {
      if (!editorRef.current) return [];

      const warnings = [NO_MATCHING_POLICY_WARNING];

      if (!objectiveToValidate) {
        return findAnyValidPolicy(policyRoleObjectives, editorRef.current) ? [] : warnings;
      }

      return isJSONValid(editorRef.current, validateFunction) ? [] : warnings;
    };

    const setErrorsAndWarnings = (): void => {
      if (!editorRef.current) return;
      const lintingErrors = getLintingErrors(editorRef.current, validateFunction);
      const warnings = getWarnings();

      codeEditorStateStore.send({
        type: 'setErrorsAndWarnings',
        errors: lintingErrors,
        warnings,
        nodeId: nodeId,
      });
    };

    const validateChange = _.debounce((): void => {
      setErrorsAndWarnings();
      codeEditorStateStore.send({ type: 'setIsValidating', payload: false });
    }, 500);

    useEffect(setErrorsAndWarnings, [isCodeEditorInitialized]);

    const onCreateEditor = (editor: EditorView): void => {
      editorRef.current = editor;
      codeEditorStateStore.send({
        type: 'initializeCodeEditor',
        content: JSON.stringify(MANAGED_POLICIES.EmptyPolicy, null, 2),
        nodeId,
      });
    };

    return (
      <CodeMirror
        value={content[nodeId]}
        onChange={newContent => {
          codeEditorStateStore.send({ type: 'setContent', content: newContent, nodeId });
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

CodeEditorCreate.displayName = 'CodeEditorCreate';
