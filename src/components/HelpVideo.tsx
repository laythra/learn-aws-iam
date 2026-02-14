import { useEffect, useState } from 'react';

import { Flex } from '@chakra-ui/react';

import { loadLocalVideo } from '@/lib/assets/video-loader';

interface HelpVideoProps {
  videoName: string;
}

export const HelpVideo: React.FC<HelpVideoProps> = ({ videoName }) => {
  const [videoSrc, setVideoSrc] = useState<string>();

  useEffect(() => {
    loadLocalVideo(videoName).then(setVideoSrc);
  }, [videoName]);

  if (!videoSrc) return null;

  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      mt={4}
      data-element-id='help-video'
      borderRadius={8}
      borderWidth='2px'
      borderColor='gray.400'
      display='inline-block'
      mx='auto'
      boxShadow='sm'
    >
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        style={{
          borderRadius: 8,
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </Flex>
  );
};
