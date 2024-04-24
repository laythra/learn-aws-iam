import { PlusSquareOutlined } from '@ant-design/icons';
import { IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

import IdentityCreator from '@/components/identity_components/IdentityCreator';
import { CodeEditor } from '@/features/code_editor';
import useCodeEditor from '@/hooks/useCodeEditor';
import useIdentityCreator from '@/hooks/useIdentityCreator';

interface NewEntityButton {}

const NewEntityButton: React.FC<NewEntityButton> = () => {
  const { openCodeEditor } = useCodeEditor();
  const { openIdentityCreator } = useIdentityCreator();

  return (
    <>
      <CodeEditor />
      <IdentityCreator />
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

export default NewEntityButton;
