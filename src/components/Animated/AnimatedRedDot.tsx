import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionDiv = motion(Box);

interface AnimatedRedDotProps {
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset?: number;
}

const AnimatedRedDot: React.FC<AnimatedRedDotProps> = ({ placement = 'top-left', offset = 5 }) => {
  const offsetPx = `${offset}px`;
  const top = placement?.includes('top') ? offsetPx : 'auto';
  const right = placement?.includes('right') ? offsetPx : 'auto';
  const left = placement?.includes('left') ? offsetPx : 'auto';
  const bottom = placement?.includes('bottom') ? offsetPx : 'auto';

  return (
    <Box position='absolute' top={top} right={right} left={left} bottom={bottom}>
      <MotionDiv
        animate={{
          scale: [1, 1.5, 1], // Expands and contracts
          opacity: [1, 0.6, 1], // Fades slightly
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
      />
    </Box>
  );
};

export default AnimatedRedDot;
