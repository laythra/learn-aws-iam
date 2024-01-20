import { PlusSquareOutlined } from '@ant-design/icons';
import { IconButton } from '@chakra-ui/react';
import CodeEditor from 'components/code_editor/CodeEditor';
import useCodeEditor from 'hooks/useCodeEditor';

interface NewEntityButton {}

const NewEntityButton: React.FC<NewEntityButton> = () => {
  const { openModal } = useCodeEditor();

  return (
    <>
      <CodeEditor />
      <IconButton aria-label='New' icon={<PlusSquareOutlined />} onClick={openModal} />
    </>
  );
};

export default NewEntityButton;
