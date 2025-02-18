import React, { useRef, useEffect } from 'react';

import { Select, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { useCodeEditor } from '../../hooks/useCodeEditor';
import codeEditorStateStore from '../../stores/code-editor-state-store';
import { CodeEditorObjectiveDescriptionBox } from '../CodeEditorObjectiveDescriptionBox';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import {
  AccountID,
  BaseFinishEventMap,
  IAMPolicyCreationObjective,
  IAMRoleCreationObjective,
} from '@/machines/types';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';
import { findAnyValidPolicy, findAnyValidRole } from '@/utils/iam-code-linter';

interface CodeEditorCreateProps {
  nodeId: string;
  selectedIAMEntity: IAMScriptableEntity;
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';
const NO_MATCHING_ROLE_WARNING = 'This role does not achieve any of the objectives.';

export const CodeEditorCreate: React.FC<CodeEditorCreateProps> = ({
  nodeId,
  selectedIAMEntity,
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

  const [selectedAccountId, errors, labelError] = useSelector(
    codeEditorStateStore,
    state => [state.context.selectedAccountId, state.context.errors, state.context.labelError],
    _.isEqual
  );

  const editorView = useRef<EditorView | null>(null);

  let objectiveToValidate:
    | IAMPolicyCreationObjective<BaseFinishEventMap>
    | IAMRoleCreationObjective<BaseFinishEventMap>
    | undefined;

  if (selectedIAMEntity === IAMNodeEntity.Policy) {
    objectiveToValidate = policyCreationObjectives.find(
      objective => objective.validate_inside_code_editor
    );
  } else {
    objectiveToValidate = roleCreationObjectives.find(
      objective => objective.validate_inside_code_editor
    );
  }

  const initialContent = objectiveToValidate?.initial_code ?? MANAGED_POLICIES.EmptyPolicy;

  const getWarnings = (): string[] => {
    if (selectedIAMEntity === IAMNodeEntity.Policy) {
      const anyValidPolicy = findAnyValidPolicy<BaseFinishEventMap>(
        policyCreationObjectives,
        editorView.current!.state.doc.toString(),
        selectedAccountId
      );

      return anyValidPolicy ? [] : [NO_MATCHING_POLICY_WARNING];
    } else {
      const anyValidRole = findAnyValidRole<BaseFinishEventMap>(
        roleCreationObjectives,
        editorView.current!.state.doc.toString(),
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
      objectiveToValidate,
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
          <option value={AccountID.Destination}>Destination Account</option>
          <option value={AccountID.Originating}>Originating Account</option>
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

      <FormControl isInvalid={errors[selectedIAMEntity][nodeId]?.length > 0}>
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
              entity: selectedIAMEntity,
            });

            validateChange();
          }}
          height='250px'
          extensions={extensions}
          onCreateEditor={onCreateEditor}
        />

        <FormErrorMessage>{errors[selectedIAMEntity][nodeId]?.[0]?.message}</FormErrorMessage>
      </FormControl>

      {objectiveToValidate?.description && (
        <CodeEditorObjectiveDescriptionBox objectiveDescription={objectiveToValidate.description} />
      )}
    </>
  );
};
