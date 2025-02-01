import { useEffect, MutableRefObject } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Extension } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { badgeExtension, InitializeBadgeWidgets } from '../utils/badge-widget';
import {
  BaseFinishEventMap,
  IAMPolicyCreationObjective,
  IAMPolicyEditObjective,
  IAMRoleCreationObjective,
  IAMTrustPolicyEditObject,
} from '@/machines/types';
import { GENERIC_VALIDATION_FNS, getLintingErrors } from '@/utils/iam-code-linter';

interface UseCodeEditorOptions {
  nodeId: string;
  editorView: MutableRefObject<EditorView | null>;
  initialContent: object;
  getWarnings: () => string[];
  objectiveToValidate?:
    | IAMPolicyCreationObjective<BaseFinishEventMap>
    | IAMRoleCreationObjective<BaseFinishEventMap>
    | IAMPolicyEditObjective<BaseFinishEventMap>
    | IAMTrustPolicyEditObject<BaseFinishEventMap>;
}

interface UseCodeEditorReturn {
  onCreateEditor: (view: EditorView) => void;
  validateChange: () => void;
  getContent: () => string;
  extensions: Extension[];
}

export function useCodeEditor({
  nodeId,
  editorView,
  objectiveToValidate,
  initialContent,
  getWarnings,
}: UseCodeEditorOptions): UseCodeEditorReturn {
  const { selectedIAMEntity, content } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['selectedIAMEntity', 'content']),
    _.isEqual
  );

  const validateFunction =
    objectiveToValidate?.validate_function ?? GENERIC_VALIDATION_FNS[selectedIAMEntity];

  const setErrorsAndWarnings = (): void => {
    if (!editorView.current) return;

    const lintingErrors = getLintingErrors(editorView.current, validateFunction);

    codeEditorStateStore.send({
      type: 'setErrorsAndWarnings',
      warnings: getWarnings(),
      errors: lintingErrors,
      nodeId,
      entity: selectedIAMEntity,
    });
  };

  const validateChange = _.debounce(() => {
    setErrorsAndWarnings();
    codeEditorStateStore.send({ type: 'setIsValidating', payload: false });
  }, 500);

  useEffect(() => {
    if (editorView.current) {
      validateChange();
      InitializeBadgeWidgets(
        editorView.current,
        objectiveToValidate?.help_badges ?? [],
        initialContent
      );
    }
  }, [selectedIAMEntity, editorView.current]);

  const onCreateEditor = (view: EditorView): void => {
    editorView.current = view;

    validateChange();

    codeEditorStateStore.send({
      type: 'initializeCodeEditor',
      nodeId,
      content: JSON.stringify(initialContent, null, 2),
      entity: selectedIAMEntity,
    });
  };

  const getContent = (): string => {
    return content[selectedIAMEntity][nodeId];
  };

  const extensions = [
    json(),
    linter(view => getLintingErrors(view, validateFunction)),
    badgeExtension,
  ];

  return {
    onCreateEditor,
    validateChange,
    getContent,
    extensions,
  };
}
