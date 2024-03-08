export interface ModalContextState {
  isModalOpen: { [key: string]: boolean };
  toggleModal: (id: string) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
}
