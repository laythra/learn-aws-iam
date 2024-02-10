import { useContext } from 'react';

import { Text, Flex, Divider, Code, Box } from '@chakra-ui/react';
import { IAMNodeContext } from 'components/nodes/IAMNodeProvider';
import SidePanel from 'components/side_panels/SidePanel';

const LeftSidePanel: React.FC = () => {
  const { selectedNode } = useContext(IAMNodeContext);

  return (
    <SidePanel alignment='right'>
      <Flex direction='column' alignItems='center'>
        <Code fontSize='lg' fontWeight='bold' p={1}>
          {selectedNode.label}
        </Code>
        <Divider my={2} />
        <Box marginTop={2}>
          <Text>{selectedNode.description}</Text>
          <pre>{JSON.stringify(selectedNode.content, null, 2)}</pre>
        </Box>
      </Flex>
    </SidePanel>
  );
};

export default LeftSidePanel;
