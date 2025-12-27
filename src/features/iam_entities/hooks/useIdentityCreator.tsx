import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import useModal from '@/hooks/useModal';
import { IAMNodeEntity } from '@/types/iam-enums';

interface IAMIdentityCreatorContextState {
  closeIdentityCreator: () => void;
  openIdentityCreator: () => void;
  isIdentityCreatorOpen: boolean;
  defaultSelectedIdentity: IAMNodeEntity.User | IAMNodeEntity.Group;
}

const MODAL_ID = 'iam-identity-manager';

export const useIdentityCreator = (): IAMIdentityCreatorContextState => {
  const defaultSelectedIdentity = LevelsProgressionContext().useSelector(
    state => state.context.identity_creation_popup_default_value || IAMNodeEntity.User
  );

  const context = useModal();

  const closeIdentityCreator = (): void => context.closeModal(MODAL_ID);
  const openIdentityCreator = (): void => context.openModal(MODAL_ID);
  const isIdentityCreatorOpen = context.isModalOpen[MODAL_ID];

  return {
    closeIdentityCreator,
    openIdentityCreator,
    isIdentityCreatorOpen,
    defaultSelectedIdentity,
  };
};
