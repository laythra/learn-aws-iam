import { Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { TOTAL_LEVELS } from '@/config/consts';
import { advanceToNextLevel } from '@/runtime/level-operations';
import { LevelDetailsStore } from '@/runtime/level-store';

const MotionButton = motion(Button);

export const GoToNextLevelButton: React.FC = () => {
  const finishedLastLevel = (): boolean => {
    const finishedLevelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
    return finishedLevelNumber === TOTAL_LEVELS;
  };

  return (
    <MotionButton
      whileHover={{
        scale: 1.1,
        boxShadow: '0px 0px 25px rgba(139, 92, 246, 1)', // Stronger glow on hover
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      data-element-id='go-to-next-level-button'
      bg='purple.500'
      color='white'
      px={6}
      py={3}
      rounded='lg'
      boxShadow='0px 0px 10px rgba(139, 92, 246, 0.5)' // Subtle glow by default
      onClick={advanceToNextLevel}
      _hover={{ bg: 'purple.600' }} // Chakra's default hover effect
      _focus={{ boxShadow: 'none' }} // Removes the blue border
    >
      {finishedLastLevel() ? `Back to level 1 ⏪` : `Go to next level 🚀`}
    </MotionButton>
  );
};
