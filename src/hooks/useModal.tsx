import { createContext, useContext, useState } from 'react';
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
    setIsModalOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };
  const openModal = (id: string): void => {
    setIsModalOpen(prevState => ({ ...prevState, [id]: true }));
  };
  const closeModal = (id: string): void => {
    setIsModalOpen(prevState => ({ ...prevState, [id]: false }));
  };
  return (
    <ModalContext.Provider value={{ isModalOpen, toggleModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextState => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
