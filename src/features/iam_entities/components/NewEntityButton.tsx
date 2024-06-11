import { PlusSquareOutlined } from '@ant-design/icons';
import { IconButton, Menu, MenuButton, MenuList, MenuItem, Box } from '@chakra-ui/react';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider';
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
          aria-label='New'
          icon={<PlusSquareOutlined />}
          onClick={hidePopovers}
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
