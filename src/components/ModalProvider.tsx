import { createContext, useState } from 'react';

import { ModalContextState } from '@/types';

interface ModalProviderProps {
  children: React.ReactNode;
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
