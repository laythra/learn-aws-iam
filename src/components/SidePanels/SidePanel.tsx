import { Flex, Box, Collapse, useTheme } from '@chakra-ui/react';

import useSidePanels from '@/hooks/useSidePanels';

interface SidePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ children, isOpen }) => {
  const theme = useTheme();
  const sidePanelsContext = useSidePanels();
  const flexBasis = isOpen ? '20%' : '0%';

  return (
    <Flex
      h={`calc(100vh - ${theme.sizes.navbarHeightInPixels})`}
      mt={theme.sizes.navbarHeightInPixels}
      direction='row-reverse'
      flexGrow={0}
      flexShrink={1}
      flexBasis={flexBasis}
      ref={sidePanelsContext.ref}
    >
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
