import { Box, HStack } from '@chakra-ui/react';
import _ from 'lodash';

import { NavbarControls } from './navbar/NavbarControls';
import { NavbarLevelInfo } from './navbar/NavbarLevelInfo';
import { NavbarSidePanelToggle } from './navbar/NavbarSidePanelToggle';
import { NavbarPopoverProvider } from './navbar/useNavbarPopover';
import { Navbar } from '@/components/Navbar';
import { useLevelSelector } from '@/runtime/level-runtime';

export const AppNavbar: React.FC = () => {
  const [levelNumber, levelTitle] = useLevelSelector(
    state => [state.context.level_number, state.context.level_title],
    _.isEqual
  );

  return (
    <NavbarPopoverProvider>
      <Navbar>
        <HStack spacing={{ base: 2, md: 4 }}>
          <Box display={{ base: 'none', md: 'flex' }}>
            <NavbarLevelInfo levelNumber={levelNumber} levelTitle={levelTitle} />
          </Box>
          <NavbarControls />
          <NavbarSidePanelToggle />
        </HStack>
      </Navbar>
    </NavbarPopoverProvider>
  );
};
