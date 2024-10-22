import { useEffect, useRef, forwardRef } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import { Node } from 'reactflow';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { IAMPolicyNodeData } from '@/types';
import { GENERIC_VALIDATION_FNS, getLintingErrors, isJSONValid } from '@/utils/iam-code-linter';

interface CodeEditorWindowProps {
  nodeId: string;
}

const VALIDATION_ERROR_WARNING =
  'Your changes have adverse effects, please review before submitting.';

export const CodeEditorEdit = forwardRef<ReactCodeMirrorRef, CodeEditorWindowProps>(
  ({ nodeId }, ref) => {
    const { selectedIAMEntity, content, isCodeEditorInitialized } = useSelector(
      codeEditorStateStore,
      state => _.pick(state.context, ['selectedIAMEntity', 'content', 'isCodeEditorInitialized']),
      _.isEqual
    );

    const { policy_role_edit_objectives: policyRoleEditObjectives, nodes } =
      LevelsProgressionContext.useSelector(
        state => _.pick(state.context, ['policy_role_edit_objectives', 'nodes']),
        _.isEqual
      );

    const selectedNode = nodes.find(node => node.id === nodeId) as Node<IAMPolicyNodeData>;
    const objectiveToValidate = policyRoleEditObjectives.find(
      objective => objective.entity_id === selectedNode.id
    );

    const validateFunction =
      objectiveToValidate?.validate_function ?? GENERIC_VALIDATION_FNS[selectedIAMEntity];

    const editorRef = useRef<EditorView>();

    const setErrorsAndWarnings = (editorView?: EditorView): void => {
      if (!editorView) return;

      const lintingErrors = getLintingErrors(editorView, validateFunction);
      const isHarmfulEdit = !isJSONValid(editorView, validateFunction);
      const warnings = isHarmfulEdit ? [VALIDATION_ERROR_WARNING] : [];

      codeEditorStateStore.send({
        type: 'setErrorsAndWarnings',
        errors: lintingErrors,
        warnings,
        nodeId,
      });
    };

    useEffect(() => setErrorsAndWarnings(editorRef.current), [isCodeEditorInitialized]);

    const validateChange = _.debounce((editorView: EditorView): void => {
      setErrorsAndWarnings(editorView);
      codeEditorStateStore.send({ type: 'setIsValidating', payload: false });
    }, 500);

    const onCreateEditor = (editor: EditorView): void => {
      editorRef.current = editor;
      codeEditorStateStore.send({
        type: 'initializeCodeEditor',
        nodeId,
        content: selectedNode.data.code,
      });
    };

    return (
      <CodeMirror
        // The content won't be loaded into the store until the editor is initialized
        value={content[nodeId] ?? selectedNode.data.code}
        onChange={(newContent, viewUpdate) => {
          codeEditorStateStore.send({ type: 'setContent', content: newContent, nodeId });
          validateChange(viewUpdate.view);
        }}
        height='200px'
        extensions={[json(), linter(view => getLintingErrors(view, validateFunction))]}
        onCreateEditor={onCreateEditor}
        ref={ref}
      />
    );
  }
);

CodeEditorEdit.displayName = 'CodeEditorEdit';
