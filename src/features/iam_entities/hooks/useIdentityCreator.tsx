import useModal from '@/hooks/useModal';

interface IAMIdentityCreatorContextState {
  closeIdentityCreator: () => void;
  openIdentityCreator: () => void;
  isIdentityCreatorOpen: boolean;
}

const MODAL_ID = 'iam-identity-manager';

export const useIdentityCreator = (): IAMIdentityCreatorContextState => {
  const context = useModal();

  const closeIdentityCreator = (): void => context.closeModal(MODAL_ID);
  const openIdentityCreator = (): void => context.openModal(MODAL_ID);
  const isIdentityCreatorOpen = context.isModalOpen[MODAL_ID];

  return {
    closeIdentityCreator,
    openIdentityCreator,
    isIdentityCreatorOpen,
  };
};
