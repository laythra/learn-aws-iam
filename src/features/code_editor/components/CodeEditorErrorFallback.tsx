import { useEffect } from 'react';

import { useToast } from '@chakra-ui/react';

import codeEditorStateStore from '@/stores/code-editor-state-store';

export const CodeEditorErrorFallback: React.FC = () => {
  const toast = useToast();

  useEffect(() => {
    codeEditorStateStore.send({ type: 'close' });
    if (!toast.isActive('code-editor-error')) {
      toast({
        id: 'code-editor-error',
        title: 'Code editor crashed',
        description: 'Something went wrong — try refreshing the page.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  return null;
};
