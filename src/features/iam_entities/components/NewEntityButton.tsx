import { IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider'; // eslint-disable-line
import { withPopover } from '@/decorators/withPopover';
import { CodeEditor } from '@/features/code_editor';
import useCodeEditor from '@/hooks/useCodeEditor';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openCodeEditor } = useCodeEditor();
  const { openIdentityCreator } = useIdentityCreator();
  const levelActor = LevelsProgressionContext.useActorRef();

  const hidePopovers = (): void => {
    levelActor.send({ type: 'HIDE_POPOVERS' });
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
          bg='transparent'
        />
        <MenuList>
          <MenuItem onClick={openIdentityCreator}>Users & Groups</MenuItem>
          <MenuItem onClick={openCodeEditor}>Roles & Policies</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export const NewEntityButtonWithPopover = withPopover(NewEntityButton);
