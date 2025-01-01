import { IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { WithPopoverMenuItem } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { withPopover } from '@/decorators/withPopover';
import { CodeEditor } from '@/features/code_editor';
import codeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { PopoverElementID } from '@/theme';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openIdentityCreator } = useIdentityCreator();
  const levelActor = LevelsProgressionContext.useActorRef();

  const hidePopovers = (): void => {
    levelActor.send({ type: 'HIDE_POPOVERS' });
  };

  const openIdentityCreatorAndSendEvent = (): void => {
    openIdentityCreator();
    levelActor.send({ type: 'CREATE_IAM_IDENTITY_POPUP_OPENED' });
  };

  const openCodeEditorAndSendEvent = (): void => {
    codeEditorPopupStore.send({ type: 'open', mode: CodeEditorMode.Create });
    levelActor.send({ type: StatelessStateMachineEvent.CreateIAMPolicyRoleWindowOpened });
  };

  return (
    <>
      <CodeEditor />
      <IdentityCreationPopup />
      <Menu>
        <MenuButton
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
          <WithPopoverMenuItem
            onClick={openIdentityCreatorAndSendEvent}
            elementid={PopoverElementID.CreateEntitiesMenuItem}
          >
            Users & Groups
          </WithPopoverMenuItem>
          <WithPopoverMenuItem /* TODO: Each button should be wrapped in a decorator that emits an event automatically on click.
                                  This is a good example of a place where we can use a decorated MenuItem variant to reduce boilerplate. */
            onClick={openCodeEditorAndSendEvent}
            elementid={PopoverElementID.CreateRolesAndPoliciesMenuItem}
          >
            Roles & Policies
          </WithPopoverMenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export const NewEntityButtonWithPopover = withPopover(NewEntityButton);
