import { useContext } from 'react';

import { ModalContext, ModalContextState } from 'components/ModalProvider';

const useModal = (): ModalContextState => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};

export default useModal;
