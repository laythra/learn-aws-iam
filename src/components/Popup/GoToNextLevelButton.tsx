import { Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import CurrentLevelDetailsStore from '@/stores/current-level-details-store';

const MotionButton = motion(Button);
const LAST_LEVEL_NUMBER = 6;
interface GoToNextLevelButtonProps {}

export const GoToNextLevelButton: React.FC<GoToNextLevelButtonProps> = () => {
  const finishedLastLevel = (): boolean => {
    const finishedLevelNumber = CurrentLevelDetailsStore.getSnapshot().context.levelNumber;
    return finishedLevelNumber == LAST_LEVEL_NUMBER;
  };

  const goToNextLevel = (): void => {
    const currentLevelNumber = CurrentLevelDetailsStore.getSnapshot().context.levelNumber;
    const nextLevelNumber = finishedLastLevel() ? 1 : currentLevelNumber + 1;

    CurrentLevelDetailsStore.send({
      type: 'setLevelNumber',
      levelNumber: nextLevelNumber,
    });
  };

  return (
    <MotionButton
      whileHover={{
        scale: 1.1,
        boxShadow: '0px 0px 25px rgba(139, 92, 246, 1)', // Stronger glow on hover
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      bg='purple.500'
      color='white'
      px={6}
      py={3}
      rounded='lg'
      boxShadow='0px 0px 10px rgba(139, 92, 246, 0.5)' // Subtle glow by default
      onClick={goToNextLevel}
      _hover={{ bg: 'purple.600' }} // Chakra's default hover effect
      _focus={{ boxShadow: 'none' }} // Removes the blue border
    >
      {finishedLastLevel() ? `Back to level 1 ⏪` : `Go to next level 🚀`}
    </MotionButton>
  );
};
