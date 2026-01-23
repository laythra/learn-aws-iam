import { HStack } from '@chakra-ui/react';

import { GoToCheckpointButton } from './GoToCheckpointButton';
import { NewEntityButton } from './NewEntityButton';
import { RestartLevelButton } from './RestartLevelButton';

interface NavbarControlsProps {}

export const NavbarControls: React.FC<NavbarControlsProps> = () => {
  return (
    <HStack spacing={4}>
      <GoToCheckpointButton />
      <RestartLevelButton />
      {/* <LevelPickerButton /> */}
      <NewEntityButton />
    </HStack>
  );
};
