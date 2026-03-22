import { useIsElementRestricted } from './useIsElementRestricted';
import { ElementID } from '@/config/element-ids';
import { useModal } from '@/hooks/useModal';
import { IAMNodeEntity } from '@/types/iam-enums';

interface IAMIdentityCreatorContextState {
  closeIdentityCreator: () => void;
  openIdentityCreator: () => void;
  isIdentityCreatorOpen: boolean;
  defaultSelectedIdentity: IAMNodeEntity.User | IAMNodeEntity.Group;
}

const MODAL_ID = 'iam-identity-manager';

export const useIdentityCreator = (): IAMIdentityCreatorContextState => {
  const [isUserCreationRestricted] = useIsElementRestricted([ElementID.CreateUserTab]);

  const context = useModal();
  const defaultSelectedIdentity = isUserCreationRestricted
    ? IAMNodeEntity.Group
    : IAMNodeEntity.User;

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
