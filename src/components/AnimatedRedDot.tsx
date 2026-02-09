import { Box, useTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { CustomTheme } from '@/types/custom-theme';

const MotionBox = motion(Box);

interface AnimatedRedDotProps {
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset?: number;
}

const AnimatedRedDot: React.FC<AnimatedRedDotProps> = ({ placement = 'top-left', offset = 6 }) => {
  const theme = useTheme<CustomTheme>();

  const offsetPx = `${offset}px`;

  const top = placement.includes('top') ? offsetPx : 'auto';
  const right = placement.includes('right') ? offsetPx : 'auto';
  const left = placement.includes('left') ? offsetPx : 'auto';
  const bottom = placement.includes('bottom') ? offsetPx : 'auto';

  return (
    <Box
      position='absolute'
      top={top}
      right={right}
      left={left}
      bottom={bottom}
      zIndex={theme.zIndices.overlay}
      pointerEvents='none'
    >
      <MotionBox
        initial={{ scale: 1, opacity: 0.7 }}
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.7, 1, 0.7],
          boxShadow: [
            '0 0 0px rgba(255, 60, 60, 0.0)',
            '0 0 10px rgba(255, 60, 60, 0.55)',
            '0 0 0px rgba(255, 60, 60, 0.0)',
          ],
        }}
        transition={{
          duration: 1.9,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: '#ff3c3c',
        }}
      />
    </Box>
  );
};

export default AnimatedRedDot;
