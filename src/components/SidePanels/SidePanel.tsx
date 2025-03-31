import { Flex, Box, useTheme } from '@chakra-ui/react';

interface SidePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ children, isOpen }) => {
  const theme = useTheme();
  const openWidth = { base: '50%', md: '30%', lg: '25%', xl: '20%' };
  const width = isOpen ? openWidth : '0%';

  return (
    <Flex
      h={`calc(100vh - ${theme.sizes.navbarHeightInPixels})`}
      mt={theme.sizes.navbarHeightInPixels}
      direction='row-reverse'
      flexGrow={0}
      flexShrink={0}
      width={width}
      transition='width 0.3s ease-in-out'
      overflow='hidden'
    >
      <Box
        h='100%'
        overflowY='auto'
        opacity={isOpen ? 1 : 0}
        transition='opacity 0.1s ease-in-out'
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <Box m={4}>{children}</Box>
      </Box>
    </Flex>
  );
};

export default SidePanel;
