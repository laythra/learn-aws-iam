import { Box, Flex, HStack, Link, Spacer, Text } from '@chakra-ui/react';

import { NewEntityButton } from '@/features/iam_entities';

interface NavbarProps {
  children: React.ReactNode;
}

export const Navbar: React.FC = () => {
  return (
    <Box position='sticky' top='0' zIndex='1000' bg='blackalpha.300' p={4} boxShadow='md'>
      <Flex alignItems='center' justifyContent='space-between'>
        <Text fontSize='xl' fontWeight='bold' color='black'>
          IAM Project
        </Text>
        <HStack spacing={4}>
          <Text fontSize='l' fontWeight='bold' color='black'>
            Level 1/10
          </Text>
          <NewEntityButton />
        </HStack>
      </Flex>
    </Box>
  );
};
