import { useContext } from 'react';

import { Text, Flex, Divider, Code, Box } from '@chakra-ui/react';

import { IAMNodeContext } from '@/components/nodes/IAMNodeProvider';
import SidePanel from '@/components/side_panels/SidePanel';

const RightSidePanel: React.FC = () => {
  const { selectedNode } = useContext(IAMNodeContext);

  return (
    <SidePanel alignment='right'>
      <Flex direction='column' alignItems='center' justifyContent='center' height='100vh'>
        <Flex direction='column' alignItems='center' height='50vh'>
          <Code fontSize='lg' fontWeight='bold' p={1}>
            Level Objective
          </Code>

          <Divider my={2} />
          <Box marginTop={2} overflowY='auto'>
            <Text>
              This levels objective is to create a simple IAM user and attach a policy to it.
            </Text>
          </Box>
        </Flex>

        <Flex direction='column' alignItems='center' height='50vh' marginTop={4} width='100%'>
          <Code fontSize='lg' fontWeight='bold' p={1}>
            {selectedNode.label}
          </Code>

          <Divider my={2} />
          <Box marginTop={2} overflowY='auto'>
            <Text>{selectedNode.description}</Text>
            <Code>{selectedNode.content}</Code>
          </Box>
        </Flex>
      </Flex>
    </SidePanel>
  );
};

export default RightSidePanel;
