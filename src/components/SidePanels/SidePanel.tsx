import { Flex, Box, Collapse } from '@chakra-ui/react';

import useSidePanels from '@/hooks/useSidePanels';

interface SidePanelProps {
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ children }) => {
  const { rightPanelOpen: isOpen } = useSidePanels();
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
