import { useState } from 'react';

import { Diagnostic } from '@codemirror/lint';
import useModal from 'hooks/useModal';
import { ModalContextState } from 'types';

interface CodeEditorContextState extends ModalContextState {
  policyErrors: Diagnostic[];
  roleErrors: Diagnostic[];
  setPolicyErrors: React.Dispatch<React.SetStateAction<Diagnostic[]>>;
  setRoleErrors: React.Dispatch<React.SetStateAction<Diagnostic[]>>;
}

const useCodeEditor = (): CodeEditorContextState => {
  const context = useModal();
  const [policyErrors, setPolicyErrors] = useState<Diagnostic[]>([]);
  const [roleErrors, setRoleErrors] = useState<Diagnostic[]>([]);

  if (!context) {
    throw new Error('useCodeEditor must be used within a ModalProvider');
  }

  return { ...context, policyErrors, roleErrors, setPolicyErrors, setRoleErrors };
};

export default useCodeEditor;
