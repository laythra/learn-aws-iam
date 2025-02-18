import { Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import CurrentLevelDetailsStore from '@/stores/current-level-details-store';

const MotionButton = motion(Button);
interface GoToNextLevelButtonProps {}

export const GoToNextLevelButton: React.FC<GoToNextLevelButtonProps> = () => {
  const goToNextLevel = (): void => {
    const currentLevelNumber = CurrentLevelDetailsStore.getSnapshot().context.levelNumber;

    CurrentLevelDetailsStore.send({
      type: 'setLevelNumber',
      levelNumber: currentLevelNumber + 1,
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
      Go To Next Level 🚀
    </MotionButton>
  );
};
