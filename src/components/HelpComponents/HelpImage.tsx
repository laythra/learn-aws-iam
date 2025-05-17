import { Flex, Box, Image } from '@chakra-ui/react';

import { loadLocalImage } from '@/utils/image-loader';

interface HelpImageProps {
  imagePath: string;
}

export const HelpImage: React.FC<HelpImageProps> = ({ imagePath }) => {
  return (
    <Flex justifyContent='center' alignItems='center' mt={4}>
      <Box
        borderRadius={8}
        borderWidth='2px'
        borderColor='gray.200'
        display='inline-block'
        mx='auto'
      >
        <Image
          src={loadLocalImage(`help-tips-gifs/${imagePath}`, 'gif')}
          borderRadius={8}
          height='auto'
          maxW='100%'
        />
      </Box>
    </Flex>
  );
};
