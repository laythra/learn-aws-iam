import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { Flex, Box, Button, Collapse } from '@chakra-ui/react';
import { useBoolean } from '@chakra-ui/react';

interface SidePanelProps {
  children: React.ReactNode;
  alignment: 'left' | 'right';
}

const SidePanel: React.FC<SidePanelProps> = ({ children, alignment }) => {
  const [showPanel, setShowPanel] = useBoolean(true);

  return (
    <Flex h='100vh' direction={alignment === 'left' ? 'row' : 'row-reverse'}>
      <Collapse
        in={true}
        style={{ width: showPanel ? '200px' : '0px', overflow: 'hidden' }}
      >
        <Box p={4}>{children}</Box>
      </Collapse>
      <Flex align='center' flex='1'>
        <Button
          colorScheme='gray'
          variant='ghost'
          onClick={setShowPanel.toggle}
        >
          {showPanel ? (
            alignment === 'left' ? (
              <CaretLeftOutlined />
            ) : (
              <CaretRightOutlined />
            )
          ) : alignment === 'left' ? (
            <CaretRightOutlined />
          ) : (
            <CaretLeftOutlined />
          )}
        </Button>
      </Flex>
    </Flex>
  );
};

export default SidePanel;
