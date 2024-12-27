import React, { useRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import { Node } from 'reactflow';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { InitializeBadgeWidgets } from '../../utils/badge-widget';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { IAMPolicyNodeData } from '@/types';
import { getLintingErrors, isJSONValid } from '@/utils/iam-code-linter';

interface CodeEditorWindowProps {
  nodeId: string;
}

const VALIDATION_ERROR_WARNING =
  'Your changes have adverse effects, please review before submitting.';

const CONTENT_UNCHANGED_WARNING = 'You have not made any changes to the policy.';

export const CodeEditorEdit: React.FC<CodeEditorWindowProps> = ({ nodeId }) => {
  const content = useSelector(codeEditorStateStore, state => state.context.content[nodeId]);

  const { policy_role_edit_objectives: policyRoleEditObjectives, nodes } =
    LevelsProgressionContext.useSelector(
      state => _.pick(state.context, ['policy_role_edit_objectives', 'nodes']),
      _.isEqual
    );

  const editorView = useRef<EditorView | null>(null);
  const selectedNode = nodes.find(node => node.id === nodeId) as Node<IAMPolicyNodeData>;
  const objectiveToValidate = policyRoleEditObjectives.find(
    objective => objective.entity_id === selectedNode.id
  )!;

  const validateFunction = objectiveToValidate.validate_function;

  const setErrorsAndWarnings = (): void => {
    if (!editorView.current) return;

    const currentContent = editorView.current.state.doc.toString();
    const lintingErrors = getLintingErrors(editorView.current, validateFunction);
    const isHarmfulEdit = !isJSONValid(currentContent, validateFunction);
    let warnings: string[] = [];

    if (currentContent === selectedNode.data.content) {
      warnings = [CONTENT_UNCHANGED_WARNING];
    } else if (isHarmfulEdit) {
      warnings = [VALIDATION_ERROR_WARNING];
    }

    codeEditorStateStore.send({
      type: 'setErrorsAndWarnings',
      errors: lintingErrors,
      warnings,
      nodeId,
    });
  };

  const validateChange = _.debounce((): void => {
    setErrorsAndWarnings();
    codeEditorStateStore.send({ type: 'setIsValidating', payload: false });
  }, 500);

  const onCreateEditor = (view: EditorView): void => {
    editorView.current = view;

    InitializeBadgeWidgets(
      view,
      objectiveToValidate.help_badges ?? [],
      JSON.parse(selectedNode.data.content)
    );
    validateChange();

    codeEditorStateStore.send({
      type: 'initializeCodeEditor',
      nodeId,
      content: selectedNode.data.content,
    });
  };

  return (
    <CodeMirror
      // The content won't be loaded into the store until the editor is initialized
      value={content ?? selectedNode.data.content}
      onChange={newContent => {
        codeEditorStateStore.send({ type: 'setContent', content: newContent, nodeId });
        validateChange();
      }}
      height='200px'
      extensions={[json(), linter(view => getLintingErrors(view, validateFunction))]}
      onCreateEditor={onCreateEditor}
    />
  );
};

CodeEditorEdit.displayName = 'CodeEditorEdit';
