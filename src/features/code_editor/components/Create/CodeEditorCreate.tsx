import React, { useEffect, useRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { badgeExtension, InitializeBadgeWidgets } from '../../utils/badge-widget';
import { limitLinesFilter } from '../../utils/code-editor-filters';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import { BaseFinishEventMap, IAMPolicyCreationObjective } from '@/machines/types';
import { IAMNodeEntity } from '@/types';
import {
  findAnyValidPolicy,
  findAnyValidRole,
  getLintingErrors,
  isJSONValid,
} from '@/utils/iam-code-linter';
import { GENERIC_VALIDATION_FNS } from '@/utils/iam-code-linter';

interface CodeEditorCreateProps {
  nodeId: string;
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';
const NO_MATCHING_ROLE_WARNING = 'This role does not achieve any of the objectives.';

export const CodeEditorCreate: React.FC<CodeEditorCreateProps> = ({ nodeId }) => {
  const [policyObjectives, roleObjectives] = LevelsProgressionContext.useSelector(
    state => [state.context.policy_objectives, state.context.role_creation_objectives],
    _.isEqual
  );
  const { selectedIAMEntity, content, selectedPolicies } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['selectedIAMEntity', 'content', 'selectedPolicies']),
    _.isEqual
  );

  const editorView = useRef<EditorView | null>(null);

  const objectiveToValidate = _.find<IAMPolicyCreationObjective<BaseFinishEventMap>>(
    policyObjectives,
    'validate_inside_code_editor'
  );

  const initialCode = objectiveToValidate?.initial_code ?? MANAGED_POLICIES.EmptyPolicy;
  const validateFunction =
    objectiveToValidate?.validate_function ?? GENERIC_VALIDATION_FNS[selectedIAMEntity];

  const getWarnings = (): string[] => {
    const warnings =
      selectedIAMEntity == IAMNodeEntity.Policy
        ? [NO_MATCHING_POLICY_WARNING]
        : [NO_MATCHING_ROLE_WARNING];

    if (objectiveToValidate) {
      return isJSONValid(editorView.current!.state.doc.toString(), validateFunction)
        ? []
        : warnings;
    }

    if (selectedIAMEntity === IAMNodeEntity.Policy) {
      const anyValidPolicy = findAnyValidPolicy<BaseFinishEventMap>(
        policyObjectives,
        editorView.current!.state.doc.toString()
      );

      return anyValidPolicy ? [] : warnings;
    } else {
      const anyValidPolicy = findAnyValidRole<BaseFinishEventMap>(
        roleObjectives,
        editorView.current!.state.doc.toString(),
        selectedPolicies
      );

      return anyValidPolicy ? [] : warnings;
    }
  };

  const setErrorsAndWarnings = (): void => {
    if (!editorView.current) return;

    const lintingErrors = getLintingErrors(
      editorView.current,
      GENERIC_VALIDATION_FNS[IAMNodeEntity.Policy]
    );

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

  useEffect(() => {
    setErrorsAndWarnings();
  }, [selectedIAMEntity]);

  const onCreateEditor = (view: EditorView): void => {
    editorView.current = view;

    InitializeBadgeWidgets(view, objectiveToValidate?.help_badges ?? [], initialCode);
    validateChange();

    // TODO: Include a pre-computed jsonized version of the initial code in the objective itself
    // notice how many times we're doing JSON.stringify for the initial content throughout the codebase
    codeEditorStateStore.send({
      type: 'setContent',
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
    />
  );
};
