import { CaretRightOutlined, CaretLeftOutlined, UserAddOutlined } from '@ant-design/icons';
import { Flex, Box, Button, Collapse, VStack, Grid } from '@chakra-ui/react';
import { useBoolean } from '@chakra-ui/react';

export default function SidePanel({ children }: { children: React.ReactNode }) {
  const [showPanel, setShowPanel] = useBoolean(true);

  return (
    <Flex h="100vh">
      <Collapse in={true} style={{ width: showPanel ? '200px' : '0px', overflow: 'hidden' }}>
        <VStack
          color="white"
          rounded="md"
          align='start'
          w="100%"
        >
          {children}
        </VStack>
      </Collapse>
      <Flex align='center' flex="1">
        <Button colorScheme='gray' variant='ghost' onClick={setShowPanel.toggle}>
          {showPanel ? <CaretLeftOutlined /> : <CaretRightOutlined />}
        </Button>
      </Flex>
    </Flex >
  );
}
