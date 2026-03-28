import { lazy, Suspense, useEffect, useState } from 'react';

import { Center, Spinner } from '@chakra-ui/react';
import { useSelector } from '@xstate/store-react';

import codeEditorStateStore from '@/stores/code-editor-state-store';

const CodeEditor = lazy(() => import('./CodeEditor').then(m => ({ default: m.CodeEditor })));

// Mount CodeEditor once it has been opened and keep it mounted so that
// close animations work correctly on subsequent opens/closes.
const CodeEditorLoader: React.FC = () => {
  const isOpen = useSelector(codeEditorStateStore, s => s.context.isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <Suspense
      fallback={
        <Center h='100vh'>
          <Spinner size='xl' />
        </Center>
      }
    >
      <CodeEditor />
    </Suspense>
  );
};

export default CodeEditorLoader;
