import React, { useRef, useEffect } from 'react';

import { Select, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Diagnostic } from '@codemirror/lint';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { useCodeEditor } from '../../hooks/useCodeEditor';
import { CodeEditorObjectiveCallout } from '../CodeEditorObjectiveCallout';
import { CodeEditorObjectiveHints } from '../CodeEditorObjectiveHints';
import { CodeEditorProgressStatus } from '../CodeEditorProgressMessage';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { ElementID } from '@/config/element-ids';
import { findAnyValidObjective, GENERIC_VALIDATION_FNS } from '@/lib/iam/iam-policy-validator';
import { MANAGED_POLICIES } from '@/machines/config';
import { GetLevelValidateFunctions } from '@/machines/functions-registry';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';

interface CodeEditorCreateProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
  errors: Diagnostic[];
  warnings: string[];
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';

export const CodeEditorCreate: React.FC<CodeEditorCreateProps> = ({
  nodeId,
  selectedIAMEntity,
  errors,
  warnings,
}) => {
  const [policyCreationObjectives, nodes, levelNumber] = LevelsProgressionContext().useSelector(
    state => [
      state.context.policy_creation_objectives,
      state.context.nodes,
      state.context.level_number,
    ],
    _.isEqual
  );

  const [selectedAccountId, labelError, label] = useSelector(
    codeEditorStateStore,
    state => [state.context.selectedAccountId, state.context.labelError, state.context.label],
    _.isEqual
  );

  const multiAccount = nodes.some(node => node.data.entity === IAMNodeEntity.Account);
  const editorView = useRef<EditorView | null>(null);
  const showMultiAccountDropdown = multiAccount && selectedIAMEntity !== IAMNodeEntity.SCP;
  const unfinishedCreationObjectives = policyCreationObjectives.filter(
    objective => !objective.finished && objective.entity === selectedIAMEntity
  );

  const objectiveToTargetInEditor = unfinishedCreationObjectives[0];
  const initialContent = objectiveToTargetInEditor?.initial_code ?? MANAGED_POLICIES.EmptyPolicy;

  const getWarnings = (): string[] => {
    if (!editorView.current) return [];
    const validateFns = GetLevelValidateFunctions(levelNumber);

    const anyValidPolicy = findAnyValidObjective(
      unfinishedCreationObjectives,
      validateFns,
      nodes,
      editorView.current.state.doc.toString(),
      selectedAccountId
    );

    return anyValidPolicy ? [] : [NO_MATCHING_POLICY_WARNING];
  };

  const validateFns = unfinishedCreationObjectives.filterMap(obj => {
    const validateFunctions = GetLevelValidateFunctions(levelNumber);
    return validateFunctions?.[obj.id](nodes);
  });

  const { onCreateEditor, extensions, validateNodeLabel, getContent } = useCodeEditor({
    nodeId,
    editorView,
    getWarnings,
    initialContent,
    validateFns: _.isEmpty(validateFns) ? [GENERIC_VALIDATION_FNS[selectedIAMEntity]] : validateFns,
    helpBadges: objectiveToTargetInEditor?.help_badges ?? [],
  });

  useEffect(() => {
    const accountNodes = nodes.filter(node => node.data.entity === IAMNodeEntity.Account);
    if (accountNodes.length > 0) {
      codeEditorStateStore.send({
        type: 'setSelectedAccount',
        selectedAccountId: accountNodes[0].id,
      });
    }
    validateNodeLabel(label[selectedIAMEntity] || '');
  }, []);

  return (
    <>
      {showMultiAccountDropdown && (
        <Select
          size='md'
          variant='filled'
          mb={4}
          width='40%'
          value={selectedAccountId}
          data-element-id={ElementID.AccountSelectionDropdown}
          onChange={e => {
            codeEditorStateStore.send({
              type: 'setSelectedAccount',
              selectedAccountId: e.target.value,
            });
          }}
        >
          {nodes
            .filter(node => node.data.entity === IAMNodeEntity.Account)
            .map(accountNode => (
              <option
                key={accountNode.id}
                value={accountNode.id}
                data-element-id={`account-option-${accountNode.id}`}
              >
                {accountNode.data.label}
              </option>
            ))}
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
              nodeId,
            });

            validateNodeLabel(newName.target.value);
          }}
          value={label[selectedIAMEntity]}
        />
        <FormErrorMessage>{labelError}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight='semibold' mt={4}>
          Code
        </FormLabel>
        <CodeMirror
          // Stable initial value only — do not control CodeMirror via React.
          // Re-applying `value` after mount causes cursor jumps and input rollbacks
          // (also breaks Playwright due to render/typing race conditions).
          value={getContent() ?? JSON.stringify(initialContent, null, 2)}
          onChange={newContent => {
            codeEditorStateStore.send({
              type: 'setContent',
              content: newContent,
              nodeId,
            });
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
