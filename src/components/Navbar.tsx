import React from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';

import { CustomTheme } from '@/types/custom-theme';

interface NavbarProps {
  children: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const theme = useTheme<CustomTheme>();

  return (
    <Flex
      position='fixed'
      top='0'
      left='0'
      right='0'
      bg='white'
      height={theme.sizes.navbarHeightInPixels}
      p={4}
      boxShadow='md'
      zIndex={theme.zIndices.docked}
      alignItems='center'
      justifyContent='space-between'
    >
      <Text fontSize='xl' fontWeight='bold' color='black' isTruncated>
        Learn AWS IAM
      </Text>
      {children}
    </Flex>
  );
};
