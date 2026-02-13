// features/tutorial/CodeEditorSystem.tsx

import { lazy, Suspense } from 'react';

import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '@/stores/code-editor-state-store';

// Lazy load the CodeEditor component to optimize initial load time.
// Code editor imports codemirror and related dependencies, which are large and not needed until the editor is opened.
const CodeEditorPopup = lazy(() =>
  import('./components/CodeEditor').then(m => ({ default: m.CodeEditor }))
);

export const CodeEditorSystem: React.FC = () => {
  const isCodeEditorOpen = useSelector(codeEditorStateStore, state => state.context.isOpen);

  if (!isCodeEditorOpen) return null;

  return (
    <Suspense fallback={null}>
      <CodeEditorPopup />
    </Suspense>
  );
};
