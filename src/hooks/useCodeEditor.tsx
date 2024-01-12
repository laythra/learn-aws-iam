import useModal from 'hooks/useModal';
import { ModalContextState } from 'types';

type entityType = 'policy' | 'role';
interface CodeEditorContextState extends ModalContextState {
  entity: entityType;
}

const useCodeEditor = (entity: entityType): CodeEditorContextState => {
  const context = useModal();

  if (!context) {
    throw new Error('useCodeEditor must be used within a ModalProvider');
  }

  return { ...context, entity };
};

export default useCodeEditor;
