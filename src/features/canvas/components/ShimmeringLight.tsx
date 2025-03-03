import { Box } from '@chakra-ui/react';

interface ShimmeringLightProps {
  isAnimating: boolean;
}

export const ShimmeringLight: React.FC<ShimmeringLightProps> = () => {
  return (
    <>
      <Box
        // opacity={isAnimating ? 1 : 0}
        // transition='opacity 0.5s'
        position='absolute'
        height='calc(100% + 8px)'
        width='calc(100% + 8px)'
        left='-4px'
        top='-4px'
        overflow='hidden'
        borderRadius='8px'
        zIndex='-1'
      >
        <Box
          className='line'
          position='absolute'
          w='48px'
          h='100%'
          background='conic-gradient(
            rgb(26, 45, 105) 0%,
            transparent 15.5%,
            transparent 87%,
          rgb(26, 45, 105) 98%
          )'
        />
      </Box>
    </>
  );
};
