import { useEffect, MutableRefObject, useState, useMemo } from 'react';

import { json } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Extension } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import { ValidateFunction } from 'ajv';
import _ from 'lodash';

import { badgeExtension, InitializeBadgeWidgets } from '../utils/BaseWidget';
import { useLevelActor } from '@/app_shell/runtime/level-runtime';
import { validateIAMName } from '@/domain/iam-graph-utils';
import { HelpBadge } from '@/levels/types/objective-types';
import { collectValidationDiagnostics } from '@/lib/iam/iam-policy-validator';
import codeEditorStateStore from '@/stores/code-editor-state-store';

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
  const levelActor = useLevelActor();
  const [selectedIAMEntity, selectedAccountId, content, isValidating] = useSelector(
    codeEditorStateStore,
    state => [
      state.context.selectedIAMEntity,
      state.context.selectedAccountId,
      state.context.content,
      state.context.isValidating,
    ],
    _.isEqual
  );

  const [editorViewState, setEditorViewState] = useState<EditorView | null>(null);

  const setCodeErrorsAndWarnings = (): void => {
    if (!editorView.current) return;

    const lintingErrors = validateFns.flatMap(validateFn =>
      collectValidationDiagnostics(editorView.current!, validateFn!)
    );

    const allErrors = _.uniqBy(lintingErrors, 'from');
    const hasErrors = validateFns.every(
      validateFn => collectValidationDiagnostics(editorView.current!, validateFn!).length > 0
    );

    codeEditorStateStore.send({
      type: 'setCodeErrorsAndWarnings',
      warnings: getWarnings(),
      errors: hasErrors ? allErrors : [],
      nodeId,
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
    return content[nodeId];
  };

  useEffect(() => {
    if (!editorViewState) return;

    validateChange();
    InitializeBadgeWidgets(editorViewState, helpBadges, initialContent);
  }, [editorViewState, selectedIAMEntity]);

  useEffect(() => {
    if (!isValidating) return;

    validateChange();
  }, [isValidating]);

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
    linter(view =>
      validateFns.flatMap(validateFn => collectValidationDiagnostics(view, validateFn!))
    ),
    badgeExtension,
  ];

  return {
    onCreateEditor,
    extensions,
    validateNodeLabel,
    getContent,
  };
}
