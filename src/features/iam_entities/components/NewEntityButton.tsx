import { IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { WithPopoverMenuItem } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider'; // eslint-disable-line
import { withPopover } from '@/decorators/withPopover';
import { CodeEditor } from '@/features/code_editor';
import useCodeEditor from '@/hooks/useCodeEditor';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openCodeEditor } = useCodeEditor();
  const { openIdentityCreator } = useIdentityCreator();
  const levelActor = LevelsProgressionContext.useActorRef();
  const levelState = LevelsProgressionContext.useSelector(state => state.context);

  const hidePopovers = (): void => {
    levelActor.send({ type: 'HIDE_POPOVERS' });
  };

  const openCodeEditorAndSendEvent = (): void => {
    openCodeEditor();
    levelActor.send({ type: 'CREATE_POLICY_POPUP_OPENED' });
  };

  return (
    <>
      <CodeEditor initialPolicy={levelState.default_policy} />
      <IdentityCreationPopup />
      <Menu>
        <MenuButton
          as={IconButton}
          size='sm'
          aria-label='New'
          icon={<PlusCircleIcon />}
          onClick={hidePopovers}
          bg='transparent'
        />
        <MenuList>
          <WithPopoverMenuItem onClick={openIdentityCreator} id='create_entities_menu_item'>
            Users & Groups
          </WithPopoverMenuItem>
          <WithPopoverMenuItem /* TODO: Each button should be wrapped in a decorator that emits an event automatically on click.
                                  This is a good example of a place where we can use a decorated MenuItem variant to reduce boilerplate. */
            onClick={openCodeEditorAndSendEvent}
            id='create_roles_and_policies_menu_item'
          >
            Roles & Policies
          </WithPopoverMenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export const NewEntityButtonWithPopover = withPopover(NewEntityButton);
