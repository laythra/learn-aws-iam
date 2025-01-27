import { IconButton, Menu, MenuList } from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import {
  GuardedMenuItemWithEventAndPopover,
  TutorialGuardedMenuButton,
} from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';
import { withPopover } from '@/decorators/withPopover';
import { CodeEditor } from '@/features/code_editor';
import codeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openIdentityCreator } = useIdentityCreator();
  const levelActor = LevelsProgressionContext.useActorRef();

  const hidePopovers = (): void => {
    levelActor.send({ type: 'HIDE_POPOVERS' });
  };

  const openCodeEditor = (): void => {
    codeEditorPopupStore.send({ type: 'open', mode: CodeEditorMode.Create });
  };

  return (
    <>
      <CodeEditor />
      <IdentityCreationPopup />
      <Menu>
        <TutorialGuardedMenuButton
          elementid={ElementID.NewEntityBtn}
          as={IconButton}
          size='sm'
          aria-label='New'
          icon={<PlusCircleIcon />}
          onClick={hidePopovers}
          color={'purple.600'}
          _hover={{ color: 'purple.500' }}
          _active={{ color: 'purple.600' }}
          bg='transparent'
        />
        <MenuList>
          <GuardedMenuItemWithEventAndPopover
            elementid={ElementID.CreateEntitiesMenuItem}
            event={StatelessStateMachineEvent.CreateIAMIdentityPopupOpened}
            onClick={openIdentityCreator}
          >
            Users & Groups
          </GuardedMenuItemWithEventAndPopover>

          <GuardedMenuItemWithEventAndPopover
            onClick={openCodeEditor}
            elementid={ElementID.CreateRolesAndPoliciesMenuItem}
            event={StatelessStateMachineEvent.CreateIAMPolicyRoleWindowOpened}
          >
            Roles & Policies
          </GuardedMenuItemWithEventAndPopover>
        </MenuList>
      </Menu>
    </>
  );
};

export const NewEntityButtonWithPopover = withPopover(NewEntityButton);
