import { HStack, Text } from '@chakra-ui/react';

interface NavbarLevelInfoProps {
  levelNumber: number;
  levelTitle: string;
}

export const NavbarLevelInfo: React.FC<NavbarLevelInfoProps> = ({ levelNumber, levelTitle }) => {
  return (
    <HStack spacing={2}>
      <Text fontSize='lg' fontWeight='bold' color='black'>
        Level {levelNumber}
      </Text>
      <Text fontSize='lg' fontWeight='semibold' color='gray.600'>
        | {levelTitle}
      </Text>
    </HStack>
  );
};
