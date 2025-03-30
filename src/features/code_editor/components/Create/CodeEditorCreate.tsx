import React, { useRef, useEffect } from 'react';

import { Select, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Diagnostic } from '@codemirror/lint';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { useCodeEditor } from '../../hooks/useCodeEditor';
import codeEditorStateStore from '../../stores/code-editor-state-store';
import { CodeEditorObjectiveCallout } from '../CodeEditorObjectiveCallout';
import { CodeEditorObjectiveHints } from '../CodeEditorObjectiveHints';
import { CodeEditorProgressStatus } from '../CodeEditorProgressMessage';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import { AccountID, BaseFinishEventMap } from '@/machines/types';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';
import { findAnyValidPolicy, findAnyValidRole } from '@/utils/iam-code-linter';

interface CodeEditorCreateProps {
  nodeId: string;
  selectedIAMEntity: IAMNodeEntity;
  errors: Diagnostic[];
  warnings: string[];
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';
const NO_MATCHING_ROLE_WARNING = 'This role does not achieve any of the objectives.';

export const CodeEditorCreate: React.FC<CodeEditorCreateProps> = ({
  nodeId,
  selectedIAMEntity,
  errors,
  warnings,
}) => {
  const [policyCreationObjectives, roleCreationObjectives, multiAccount] =
    LevelsProgressionContext().useSelector(
      state => [
        state.context.policy_creation_objectives,
        state.context.role_creation_objectives,
        state.context.use_multi_account_canvas,
      ],
      _.isEqual
    );

  const [selectedAccountId, labelError] = useSelector(
    codeEditorStateStore,
    state => [state.context.selectedAccountId, state.context.labelError],
    _.isEqual
  );

  const editorView = useRef<EditorView | null>(null);
  const unfinishedPolicyCreationObjectives = policyCreationObjectives.filter(
    objective => objective.validate_inside_code_editor && !objective.finished
  );
  const unfinishedRoleCreationObjectives = roleCreationObjectives.filter(
    objective => objective.validate_inside_code_editor && !objective.finished
  );

  const objectiveToTargetInEditor =
    selectedIAMEntity === IAMNodeEntity.Policy
      ? unfinishedPolicyCreationObjectives[0]
      : unfinishedRoleCreationObjectives[0];

  const initialContent = objectiveToTargetInEditor?.initial_code ?? MANAGED_POLICIES.EmptyPolicy;
  const getWarnings = (): string[] => {
    if (!editorView.current) return [];

    if (selectedIAMEntity === IAMNodeEntity.Policy) {
      const anyValidPolicy = findAnyValidPolicy<BaseFinishEventMap>(
        unfinishedPolicyCreationObjectives,
        editorView.current.state.doc.toString(),
        selectedAccountId
      );

      return anyValidPolicy ? [] : [NO_MATCHING_POLICY_WARNING];
    } else {
      const anyValidRole = findAnyValidRole<BaseFinishEventMap>(
        unfinishedRoleCreationObjectives,
        editorView.current.state.doc.toString(),
        selectedAccountId
      );

      return anyValidRole ? [] : [NO_MATCHING_ROLE_WARNING];
    }
  };

  const { onCreateEditor, validateChange, getContent, extensions, validateNodeLabel } =
    useCodeEditor({
      nodeId,
      editorView,
      getWarnings,
      objectivesToValidate:
        selectedIAMEntity == IAMNodeEntity.Policy
          ? unfinishedPolicyCreationObjectives
          : unfinishedRoleCreationObjectives,
      initialContent: initialContent,
    });

  useEffect(() => {
    validateChange();
  }, [selectedAccountId]);

  useEffect(() => {
    validateNodeLabel('');
  }, []);

  return (
    <>
      {multiAccount && (
        <Select
          size='md'
          variant='filled'
          mb={4}
          width='40%'
          value={selectedAccountId}
          onChange={e => {
            codeEditorStateStore.send({
              type: 'setSelectedAccount',
              selectedAccountId: e.target.value as AccountID,
            });
          }}
        >
          <option value={AccountID.Trusting}>Trusting Account</option>
          <option value={AccountID.Trusted}>Trusted Account</option>
        </Select>
      )}

      <FormControl isInvalid={labelError !== undefined}>
        <FormLabel fontWeight='semibold'>{selectedIAMEntity} Name</FormLabel>
        <Input
          placeholder='Any descriptive name you prefer...'
          onChange={newName => {
            codeEditorStateStore.send({
              type: 'setNodeLabel',
              label: newName.target.value,
            });

            validateNodeLabel(newName.target.value);
          }}
        />
        <FormErrorMessage>{labelError}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight='semibold' mt={4}>
          Code
        </FormLabel>
        <CodeMirror
          value={getContent() ?? JSON.stringify(initialContent, null, 2)}
          onChange={newContent => {
            codeEditorStateStore.send({
              type: 'setContent',
              content: newContent,
              nodeId,
              entity: selectedIAMEntity as IAMScriptableEntity,
            });

            validateChange();
          }}
          height='250px'
          extensions={extensions}
          onCreateEditor={onCreateEditor}
        />
      </FormControl>
      {!_.isEmpty(errors) && <CodeEditorProgressStatus message={errors[0].message} level='error' />}
      {!_.isEmpty(warnings) && _.isEmpty(errors) && (
        <CodeEditorProgressStatus message={warnings[0]} level='warning' />
      )}
      {_.isEmpty(errors) && _.isEmpty(warnings) && (
        <CodeEditorProgressStatus message='You got it right!' level='success' />
      )}
      {objectiveToTargetInEditor?.callout_message && (
        <CodeEditorObjectiveCallout calloutMessage={objectiveToTargetInEditor.callout_message} />
      )}
      {objectiveToTargetInEditor?.hint_messages && (
        <CodeEditorObjectiveHints objectiveHints={objectiveToTargetInEditor?.hint_messages} />
      )}
    </>
  );
};
