import { PlusSquareOutlined } from '@ant-design/icons';
import { IconButton, Menu, MenuButton, MenuList, MenuItem, Box } from '@chakra-ui/react';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { withPopover } from '@/decorators/withPopover';
import { CodeEditor } from '@/features/code_editor';
import useCodeEditor from '@/hooks/useCodeEditor';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openCodeEditor } = useCodeEditor();
  const { openIdentityCreator } = useIdentityCreator();

  return (
    <>
      <CodeEditor />
      <IdentityCreationPopup />
      <Menu>
        <MenuButton as={IconButton} aria-label='New' icon={<PlusSquareOutlined />} />
        <MenuList>
          <MenuItem onClick={openIdentityCreator}>Users & Groups</MenuItem>
          <MenuItem onClick={openCodeEditor}>Roles & Policies</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export const NewEntityButtonWithPopover = withPopover(NewEntityButton);
