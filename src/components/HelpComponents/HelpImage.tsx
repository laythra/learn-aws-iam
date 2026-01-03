import { Flex, Image } from '@chakra-ui/react';

import { loadTutorialGif } from '@/utils/image-loader';

interface HelpImageProps {
  gifName: string;
}

export const HelpImage: React.FC<HelpImageProps> = ({ gifName }) => {
  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      mt={4}
      data-element-id='help-image-gif'
      borderRadius={8}
      borderWidth='2px'
      borderColor='gray.400'
      display='inline-block'
      mx='auto'
      boxShadow='sm'
    >
      <Image src={loadTutorialGif(gifName)} borderRadius={8} height='auto' maxW='100%' />
    </Flex>
  );
};
