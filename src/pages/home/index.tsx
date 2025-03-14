import React from 'react';

import { Flex, Box, useTheme, CustomThemeTypings } from '@chakra-ui/react';

import { Navbar } from '@/components/Navbar';
import { FixedPopover } from '@/components/Popover/FixedPopover';
import { TutorialPopup } from '@/components/Popup/TutorialPopup';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import RightSidePanel from '@/components/SidePanels/RightSidePanel';
import RightSidePanelToggleButton from '@/components/SidePanels/RightSidePanelToggleButton';
import Canvas from '@/features/canvas/components/Canvas';
import MultiAccountCanvas from '@/features/canvas/components/MultiAccountCanvas';
import { CustomTheme } from '@/types';

const Home: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const useMultiAccountCanvas = LevelsProgressionContext().useSelector(
    state => state.context.use_multi_account_canvas
  );
  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <TutorialPopup />
      <Navbar />
      <Box h='100vh' w='100%' pt={theme.sizes.navbarHeightInPixels}>
        {useMultiAccountCanvas ? <MultiAccountCanvas /> : <Canvas />}
      </Box>
      <FixedPopover />
      <RightSidePanelToggleButton />
      <RightSidePanel />
    </Flex>
  );
};

export default Home;
