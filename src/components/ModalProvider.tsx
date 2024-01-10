import { createContext } from 'react';

import { useBoolean } from '@chakra-ui/react';

export interface ModalContextState {
  modalOpen: boolean;
  toggleModal: () => void;
  openModal: () => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalContext = createContext<ModalContextState | undefined>(undefined);

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalOpen, setModalOpen] = useBoolean(false);

  const toggleModal = (): void => setModalOpen.toggle();
  const openModal = (): void => setModalOpen.on();
  const closeModal = (): void => setModalOpen.off();

  return (
    <ModalContext.Provider value={{ modalOpen, toggleModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
