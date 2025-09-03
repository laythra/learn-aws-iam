import { IconButton, Tooltip, Box } from '@chakra-ui/react';
import { ArrowPathIcon } from '@heroicons/react/16/solid';

import currentLevelDetailsStore from '@/stores/current-level-details-store';

interface GoToCheckpointButtonProps {}

export const RestartLevelButton: React.FC<GoToCheckpointButtonProps> = () => {
  const restartLevel = (): void => {
    currentLevelDetailsStore.send({ type: 'restartLevel' });
  };

  return (
    <Tooltip label='Restart Level'>
      <Box>
        <IconButton
          onClick={restartLevel}
          icon={<ArrowPathIcon />}
          aria-label='return-to-checkpoint-button'
          color='gray.600'
          _hover={{ color: 'black' }}
          _active={{ color: 'black' }}
          bg='transparent'
          size='xs'
        />
      </Box>
    </Tooltip>
  );
};
