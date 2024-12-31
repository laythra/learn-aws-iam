import React, { useRef } from 'react';

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import _ from 'lodash';

import { useCodeEditor } from '../../hooks/useCodeEditor';
import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import {
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
  const [policyCreationObjectives, roleCreationObjectives] = LevelsProgressionContext.useSelector(
    state => [state.context.policy_creation_objectives, state.context.role_creation_objectives],
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
    console.log('Attempting to find a role objective to validate');
    objectiveToValidate = roleCreationObjectives.find(
      objective => objective.validate_inside_code_editor
    );
    debugger;
  }

  const initialContent = objectiveToValidate?.initial_code ?? MANAGED_POLICIES.EmptyPolicy;

  const getWarnings = (): string[] => {
    if (selectedIAMEntity === IAMNodeEntity.Policy) {
      const anyValidPolicy = findAnyValidPolicy<BaseFinishEventMap>(
        policyCreationObjectives,
        editorView.current!.state.doc.toString()
      );

      return anyValidPolicy ? [] : [NO_MATCHING_POLICY_WARNING];
    } else {
      const anyValidPolicy = findAnyValidRole<BaseFinishEventMap>(
        roleCreationObjectives,
        editorView.current!.state.doc.toString(),
        []
      );

      return anyValidPolicy ? [] : [NO_MATCHING_ROLE_WARNING];
    }
  };

  const { onCreateEditor, validateChange, getContent, extensions } = useCodeEditor({
    nodeId,
    editorView,
    getWarnings,
    objectiveToValidate,
    initialContent: initialContent,
  });

  return (
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
      height='200px'
      extensions={extensions}
      onCreateEditor={onCreateEditor}
    />
  );
};
