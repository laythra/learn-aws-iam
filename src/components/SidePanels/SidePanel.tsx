import { Flex, Box, Collapse } from '@chakra-ui/react';

interface SidePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ children, isOpen }) => {
  const flexBasis = isOpen ? '20%' : '0%';

  return (
    <Flex h='100vh' direction='row-reverse' flexGrow={0} flexShrink={1} flexBasis={flexBasis}>
      <Collapse in style={{ overflow: 'hidden' }}>
        {isOpen && (
          <Box h='100%' overflowY='auto'>
            <Box m={4}>{children}</Box>
          </Box>
        )}
      </Collapse>
    </Flex>
  );
};

export default SidePanel;
