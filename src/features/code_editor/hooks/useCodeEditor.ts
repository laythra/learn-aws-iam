import { useEffect, MutableRefObject, useState } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Extension } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import { ValidateFunction } from 'ajv';
import _ from 'lodash';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { badgeExtension, InitializeBadgeWidgets } from '../utils/badge-widget';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { HelpBadge } from '@/machines/types';
import { getLintingErrors } from '@/utils/iam-code-linter';

interface UseCodeEditorOptions {
  nodeId: string;
  editorView: MutableRefObject<EditorView | null>;
  initialContent: object;
  getWarnings: () => string[];
  validateFns: ValidateFunction[];
  helpBadges: HelpBadge[];
}

interface UseCodeEditorReturn {
  onCreateEditor: (view: EditorView) => void;
  validateChange: () => void;
  getContent: () => string;
  extensions: Extension[];
  validateNodeLabel: (label: string) => void;
}

export function useCodeEditor({
  nodeId,
  editorView,
  initialContent,
  validateFns,
  helpBadges,
  getWarnings,
}: UseCodeEditorOptions): UseCodeEditorReturn {
  const levelActor = LevelsProgressionContext().useActorRef();
  const { selectedIAMEntity, content } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['selectedIAMEntity', 'content']),
    _.isEqual
  );

  const [editorViewState, setEditorViewState] = useState<EditorView | null>(null);

  const setCodeErrorsAndWarnings = (): void => {
    if (!editorView.current) return;

    const lintingErrors = validateFns.flatMap(validateFn =>
      getLintingErrors(editorView.current!, validateFn!)
    );
    const allErrors = _.uniqBy(lintingErrors, 'from');
    const hasErrors = validateFns.every(
      validateFn => getLintingErrors(editorView.current!, validateFn!).length > 0
    );

    codeEditorStateStore.send({
      type: 'setCodeErrorsAndWarnings',
      warnings: getWarnings(),
      errors: hasErrors ? allErrors : [],
      nodeId,
      entity: selectedIAMEntity,
    });
  };

  const validateChange = _.debounce(() => {
    setCodeErrorsAndWarnings();
    codeEditorStateStore.send({ type: 'setIsValidating', payload: false });
  }, 500);

  useEffect(() => {
    if (!editorViewState) return;

    validateChange();
    InitializeBadgeWidgets(editorViewState, helpBadges, initialContent);
  }, [editorViewState, selectedIAMEntity]);

  const onCreateEditor = (view: EditorView): void => {
    setEditorViewState(view);
    editorView.current = view;

    validateChange();
  };

  const getContent = (): string => {
    return content[selectedIAMEntity][nodeId];
  };

  const validateNodeLabel = _.debounce((label: string): void => {
    const existinglabels = levelActor.getSnapshot().context.nodes.map(node => node.data.label);
    let error: string | undefined = undefined;

    if (existinglabels.includes(label)) {
      error = 'label already exists';
    } else if (label.length < 1 || label.length > 64) {
      error = 'Must be between 1 and 64 characters';
    } else if (!/^[a-zA-Z0-9]/.test(label)) {
      error = 'Must start with a letter or number';
    } else if (!/^[a-zA-Z0-9+=,.@_-]+$/.test(label)) {
      error = 'Only letters, numbers, and +=,.@-_ are allowed';
    }

    codeEditorStateStore.send({
      type: 'setNodeLabelError',
      error,
      isValidating: false,
    });
  }, 500);

  const extensions = [
    json(),
    linter(view => validateFns.flatMap(validateFn => getLintingErrors(view, validateFn!))),
    badgeExtension,
  ];

  return {
    onCreateEditor,
    validateChange,
    getContent,
    extensions,
    validateNodeLabel,
  };
}
