import React, { useRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import CodeMirror, { EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { badgeExtension, InitializeBadgeWidgets } from '../../utils/badge-widget';
import { limitLinesFilter } from '../../utils/code-editor-filters';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import { BaseFinishEventMap, IAMPolicyRoleCreationObjective } from '@/machines/types';
import { findAnyValidPolicy, getLintingErrors, isJSONValid } from '@/utils/iam-code-linter';
import { GENERIC_VALIDATION_FNS } from '@/utils/iam-code-linter';

interface CodeEditorCreateProps {
  nodeId: string;
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';

export const CodeEditorCreate: React.FC<CodeEditorCreateProps> = ({ nodeId }) => {
  const policyRoleObjectives = LevelsProgressionContext.useSelector(
    state => state.context.policy_role_objectives
  );
  const { selectedIAMEntity, content, isCodeEditorInitialized } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['selectedIAMEntity', 'content', 'isCodeEditorInitialized']),
    _.isEqual
  );

  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const editorView = useRef<EditorView | null>(null);
  // const badgesInitialized = useRef(false);

  const objectiveToValidate = _.find<IAMPolicyRoleCreationObjective<BaseFinishEventMap>>(
    policyRoleObjectives,
    'validate_inside_code_editor'
  );

  const initialCode = objectiveToValidate?.initial_code ?? MANAGED_POLICIES.EmptyPolicy;
  const validateFunction =
    objectiveToValidate?.validate_function ?? GENERIC_VALIDATION_FNS[selectedIAMEntity];

  const getWarnings = (): string[] => {
    const warnings = [NO_MATCHING_POLICY_WARNING];

    if (!objectiveToValidate) {
      const anyValidPolicy = findAnyValidPolicy<BaseFinishEventMap>(
        policyRoleObjectives,
        content[selectedIAMEntity]
      );

      anyValidPolicy ? [] : warnings;
    }

    return isJSONValid(content[selectedIAMEntity], validateFunction) ? [] : warnings;
  };

  const setErrorsAndWarnings = (): void => {
    if (!editorRef.current?.view) return;

    const lintingErrors = getLintingErrors(editorRef.current.view, validateFunction);
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

  const onCreateEditor = (view: EditorView): void => {
    editorView.current = view;

    InitializeBadgeWidgets(view, objectiveToValidate?.help_badges ?? [], initialCode);

    // TODO: Include a pre-computed jsonized version of the initial code
    // notice how many times we're doing it throughout the codebase
    codeEditorStateStore.send({
      type: 'initializeCodeEditor',
      content: JSON.stringify(initialCode, null, 2),
      nodeId,
    });
  };

  const extensions = [
    json(),
    linter(view => getLintingErrors(view, validateFunction)),
    badgeExtension,
  ];

  if (objectiveToValidate?.limit_new_lines) {
    extensions.push(limitLinesFilter(JSON.stringify(initialCode, null, 2)));
  }

  return (
    <CodeMirror
      value={content[nodeId] ?? JSON.stringify(initialCode, null, 2)}
      onChange={newContent => {
        codeEditorStateStore.send({ type: 'setContent', content: newContent, nodeId });
        validateChange();
      }}
      height='200px'
      extensions={extensions}
      onCreateEditor={onCreateEditor}
      ref={editorRef}
    />
  );
};
