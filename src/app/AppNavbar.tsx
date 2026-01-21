import { HStack } from '@chakra-ui/react';
import _ from 'lodash';

import { NavbarControls } from './Navbar/NavbarControls';
import { NavbarLevelInfo } from './Navbar/NavbarLevelInfo';
import { NavbarSidePanelToggle } from './Navbar/NavbarSidePanelToggle';
import { NavbarPopoverProvider } from './Navbar/useNavbarPopover';
import { Navbar } from '@/components/Navbar';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { ElementID } from '@/config/element-ids';
import { useAnimatedRedDot } from '@/hooks/useAnimatedRedDot';

interface AppNavbarProps {}

export const AppNavbar: React.FC<AppNavbarProps> = () => {
  const [levelNumber, levelTitle] = LevelsProgressionContext().useSelector(
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
