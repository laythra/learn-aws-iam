import { HStack } from '@chakra-ui/react';
import _ from 'lodash';

import { NavbarControls } from './navbar/NavbarControls';
import { NavbarLevelInfo } from './navbar/NavbarLevelInfo';
import { NavbarSidePanelToggle } from './navbar/NavbarSidePanelToggle';
import { NavbarPopoverProvider } from './navbar/useNavbarPopover';
import { useAnimatedRedDot } from '@/app_shell/ui/useAnimatedRedDot';
import { Navbar } from '@/components/Navbar';
import { ElementID } from '@/config/element-ids';
import { useLevelSelector } from '@/runtime/level-runtime';

export const AppNavbar: React.FC = () => {
  const [levelNumber, levelTitle] = useLevelSelector(
    state => [state.context.level_number, state.context.level_title],
    _.isEqual
  );

  const { isRedDotEnabledForElement } = useAnimatedRedDot({
    elementIds: [ElementID.RightSidePanelToggleButton],
  });

  return (
    <NavbarPopoverProvider>
      <Navbar>
        <HStack spacing={4}>
          <NavbarLevelInfo levelNumber={levelNumber} levelTitle={levelTitle} />
          <NavbarControls />
          <NavbarSidePanelToggle
            isRedDotEnabled={isRedDotEnabledForElement(ElementID.RightSidePanelToggleButton)}
          />
        </HStack>
      </Navbar>
    </NavbarPopoverProvider>
  );
};
