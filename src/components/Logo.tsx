import { Text, Box, useTheme } from '@chakra-ui/react';

interface LogoProps {}

const Logo: React.FC<LogoProps> = () => {
  const theme = useTheme();

  return (
    <Box position='absolute' top='3%' left='3%' zIndex={theme.zIndices.toast}>
      <Text position='fixed' fontSize='2xl' fontWeight='700'>
        IAM Project
      </Text>
    </Box>
  );
};

export default Logo;
