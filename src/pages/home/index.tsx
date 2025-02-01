import React from 'react';

import { Flex, Box } from '@chakra-ui/react';

import { Navbar } from '@/components/Navbar';
import { TutorialPopup } from '@/components/Popup/TutorialPopup';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import RightSidePanel from '@/components/SidePanels/RightSidePanel';
import RightSidePanelToggleButton from '@/components/SidePanels/RightSidePanelToggleButton';
import Canvas from '@/features/canvas/components/Canvas';
import MultiAccountCanvas from '@/features/canvas/components/MultiAccountCanvas';

const Home: React.FC = () => {
  const useMultiAccountCanvas = LevelsProgressionContext().useSelector(
    state => state.context.use_multi_account_canvas
  );
  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <TutorialPopup />
      <Box flex='1 1 90%'>
        <Navbar />
        {useMultiAccountCanvas ? <MultiAccountCanvas /> : <Canvas />}
      </Box>
      <RightSidePanelToggleButton />
      <RightSidePanel />
    </Flex>
  );
};

export default Home;
