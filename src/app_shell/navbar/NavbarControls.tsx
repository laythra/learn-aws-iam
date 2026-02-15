import { HStack } from '@chakra-ui/react';

import { GoToCheckpointButton } from './GoToCheckpointButton';
import { LevelPickerButton } from './LevelPickerButton';
import { NewEntityButton } from './NewEntityButton';
import { RestartLevelButton } from './RestartLevelButton';

export const NavbarControls: React.FC = () => {
  return (
    <HStack spacing={4}>
      <GoToCheckpointButton />
      <RestartLevelButton />
      <LevelPickerButton />
      <NewEntityButton />
    </HStack>
  );
};
