import { useEffect, MutableRefObject, useState, useMemo } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Extension } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import { ValidateFunction } from 'ajv';
import _ from 'lodash';

import { badgeExtension, InitializeBadgeWidgets } from '../utils/badge-widget';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { HelpBadge } from '@/machines/types/objective-types';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { getLintingErrors } from '@/utils/iam-code-linter';
import { validateIAMName } from '@/utils/names';

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
  extensions: Extension[];
  validateNodeLabel: (label: string) => void;
  getContent: () => string;
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
  const { selectedIAMEntity, selectedAccountId, content } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['selectedIAMEntity', 'selectedAccountId', 'content']),
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

  const validateChange = useMemo(
    () =>
      _.debounce(() => {
        setCodeErrorsAndWarnings();
        codeEditorStateStore.send({ type: 'setIsValidating', payload: false });
      }, 500),
    [nodeId, selectedIAMEntity, selectedAccountId]
  );

  const getContent = (): string => {
    return content[selectedIAMEntity][nodeId];
  };

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

  const validateNodeLabel = _.debounce((label: string): void => {
    const existinglabels = levelActor.getSnapshot().context.nodes.map(node => node.data.label);
    const error = validateIAMName(label, existinglabels, 64);

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
    extensions,
    validateNodeLabel,
    getContent,
  };
}
