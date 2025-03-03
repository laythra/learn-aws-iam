import { Box } from '@chakra-ui/react';

interface ShimmerBackgroundProps {
  className: string;
}

export const ShimmerBackground: React.FC<ShimmerBackgroundProps> = ({ className }) => {
  return (
    // Wrapping with an overflow='hidden' Box to prevent the shimmer from overflowing
    // and spilling over to adjacent nodes in the canvas
    <Box
      position='absolute'
      top={0}
      left={0}
      width='100%'
      height='100%'
      overflow='hidden'
      pointerEvents='none' // Prevents the shimmer from blocking mouse events
    >
      <Box
        className={className}
        position='absolute'
        top={0}
        left={0}
        width='100%'
        height='100%'
        background={`linear-gradient(
                  120deg,
                  rgba(255,255,255,0) 0%,
                  rgba(255,255,255,0.5) 50%,
                  rgba(255,255,255,0) 100%)`}
        transform={`translateX(-100%)`}
      />
    </Box>
  );
};
