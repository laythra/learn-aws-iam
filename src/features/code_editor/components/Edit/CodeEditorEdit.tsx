import React, { useRef } from 'react';

import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { ValidateFunction } from 'ajv';
import _ from 'lodash';

import { useCodeEditor } from '../../hooks/useCodeEditor';
import { CodeEditorObjectiveCallout } from '../CodeEditorObjectiveCallout';
import { CodeEditorObjectiveHints } from '../CodeEditorObjectiveHints';
import { CodeEditorProgressStatus } from '../CodeEditorProgressMessage';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { GetLevelValidateFunctions } from '@/machines/functions-registry';
import {
  BaseFinishEventMap,
  IAMPolicyEditObjective,
  IAMTrustPolicyEditObjective,
} from '@/machines/types/objective-types';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMNodeEntity, IAMCodeDefinedEntity } from '@/types/iam-enums';
import { GENERIC_VALIDATION_FNS, isJSONValid } from '@/utils/iam-code-linter';

interface CodeEditorEditProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
  errors: Diagnostic[];
  warnings: string[];
}

const VALIDATION_ERROR_WARNING =
  'Your changes do not satisfy the requirements. Please review before submitting.';

const CONTENT_UNCHANGED_WARNING = 'You have not made any changes to the policy.';

export const CodeEditorEdit: React.FC<CodeEditorEditProps> = ({
  nodeId,
  selectedIAMEntity,
  errors,
  warnings,
}) => {
  const [policyEditObjectives, nodes, levelNumber] = LevelsProgressionContext().useSelector(
    state => [
      state.context.policy_edit_objectives,
      state.context.nodes,
      state.context.level_number,
    ],
    _.isEqual
  );

  const editorView = useRef<EditorView | null>(null);
  const selectedNode = nodes.find(
    node => node.id === nodeId && node.data.entity === selectedIAMEntity
  )!;

  let objectiveToValidate:
    | IAMPolicyEditObjective<BaseFinishEventMap>
    | IAMTrustPolicyEditObjective<BaseFinishEventMap>
    | undefined;

  let objectiveValidationFn: ValidateFunction | undefined;

  if (selectedIAMEntity === IAMNodeEntity.Policy) {
    objectiveToValidate = policyEditObjectives.find(
      objective => objective.id === selectedNode?.data.id
    );
    objectiveValidationFn =
      objectiveToValidate &&
      GetLevelValidateFunctions(levelNumber)[objectiveToValidate?.validate_fn_name]?.(nodes);
  } else {
    // TODO: Support role editing
    throw new Error('Role editing is not supported yet');
  }

  const getWarnings = (): string[] => {
    if (!editorView.current) return [];

    const currentContent = editorView.current.state.doc.toString();
    const isHarmfulEdit = !isJSONValid(
      currentContent,
      objectiveValidationFn ?? GENERIC_VALIDATION_FNS[selectedIAMEntity]
    );

    if (currentContent === selectedNode.data.content) {
      return [CONTENT_UNCHANGED_WARNING];
    } else if (isHarmfulEdit) {
      return [VALIDATION_ERROR_WARNING];
    } else {
      return [];
    }
  };

  const { onCreateEditor, validateChange, extensions } = useCodeEditor({
    nodeId,
    editorView,
    getWarnings,
    initialContent: JSON.parse(selectedNode.data.content ?? '{}'),
    validateFns: [objectiveValidationFn ?? GENERIC_VALIDATION_FNS[selectedIAMEntity]],
    helpBadges: objectiveToValidate?.help_badges ?? [],
  });

  return (
    <>
      <CodeMirror
        // The content won't be loaded into the store until the editor is initialized
        value={selectedNode.data.content}
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
      {!_.isEmpty(errors) && <CodeEditorProgressStatus message={errors[0].message} level='error' />}
      {!_.isEmpty(warnings) && _.isEmpty(errors) && (
        <CodeEditorProgressStatus message={warnings[0]} level='warning' />
      )}
      {_.isEmpty(errors) && _.isEmpty(warnings) && (
        <CodeEditorProgressStatus message='You got it right!' level='success' />
      )}

      {objectiveToValidate?.callout_message && (
        <CodeEditorObjectiveCallout calloutMessage={objectiveToValidate.callout_message} />
      )}
      {objectiveToValidate?.hint_messages && (
        <CodeEditorObjectiveHints objectiveHints={objectiveToValidate?.hint_messages} />
      )}
    </>
  );
};

CodeEditorEdit.displayName = 'CodeEditorEdit';
