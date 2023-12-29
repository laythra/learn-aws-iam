import { Text, Box } from '@chakra-ui/react';

interface LogoProps {}

const Logo: React.FC<LogoProps> = () => {
  return (
    <Box position='absolute' top='3%' left='3%'>
      <Text position='fixed' fontSize='2xl' fontWeight='700'>
        IAM Project
      </Text>
    </Box>
  );
};

export default Logo;
