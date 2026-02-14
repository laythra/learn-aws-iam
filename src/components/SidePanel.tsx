import { Box, useTheme } from '@chakra-ui/react';

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
    <Box
      h={`calc(100vh - ${theme.sizes.navbarHeightInPixels})`}
      mt={theme.sizes.navbarHeightInPixels}
      w={width}
      transition={`
        width ${transitionDuration}ms ease-in-out,
        opacity ${transitionDuration}ms ease-in-out`}
      overflow='hidden'
      overflowY='auto'
      px={4}
      py={4}
      opacity={isOpen ? 1 : 0}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      {children}
    </Box>
  );
};

export default SidePanel;
