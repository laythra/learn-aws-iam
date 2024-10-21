import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';

import { NewEntityButtonWithPopover } from '@/features/iam_entities';
import { CustomTheme } from '@/types';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const theme = useTheme<CustomTheme>();

  return (
    <Box
      position='sticky'
      top='0'
      bg='white'
      height={theme.sizes.navbarHeightInPixels}
      p={4}
      boxShadow='md'
      zIndex={theme.zIndices.docked}
    >
      <Flex alignItems='center' justifyContent='space-between'>
        <Text fontSize='xl' fontWeight='bold' color='black'>
          IAM Project
        </Text>
        <HStack spacing={4}>
          <Text fontSize='lg' fontWeight='bold' color='black'>
            Level 1/10
          </Text>
          <NewEntityButtonWithPopover elementid='new_entity_btn' />
        </HStack>
      </Flex>
    </Box>
  );
};
