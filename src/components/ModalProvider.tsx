import { createContext, useState } from 'react';

interface ModalProviderProps {
  children: React.ReactNode;
}

export interface ModalContextState {
  isModalOpen: { [key: string]: boolean };
  toggleModal: (id: string) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
}

export const ModalContext = createContext<ModalContextState | undefined>(undefined);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<{ [key: string]: boolean }>({});

  const toggleModal = (id: string): void => {
    setIsModalOpen(prevState => ({ ...prevState, [id]: true }));
  };

  const openModal = (id: string): void => {
    setIsModalOpen(prevStat => ({ ...prevStat, [id]: true }));
  };

  const closeModal = (id: string): void => {
    setIsModalOpen(prevStat => ({ ...prevStat, [id]: false }));
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, toggleModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
