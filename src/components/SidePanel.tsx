import { Flex, Box, useTheme } from '@chakra-ui/react';

interface SidePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  transitionDuration: number;
}

const SidePanel: React.FC<SidePanelProps> = ({ children, isOpen, transitionDuration }) => {
  const theme = useTheme();
  const openWidth = { base: '50%', md: '30%', lg: '25%', xl: '20%' };
  const width = isOpen ? openWidth : '0%';

  return (
    <Flex
      h={`calc(100vh - ${theme.sizes.navbarHeightInPixels})`}
      mt={theme.sizes.navbarHeightInPixels}
      direction='row'
      flexGrow={0}
      flexShrink={0}
      w={width}
      transition={`width ${transitionDuration}ms ease-in-out`}
      overflow='hidden'
    >
      <Box
        flex='1'
        overflowY='auto'
        px={4}
        py={4}
        opacity={isOpen ? 1 : 0}
        transition={`opacity ${transitionDuration}ms ease-in-out`}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default SidePanel;
