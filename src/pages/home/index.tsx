import React from 'react';

import { Flex, Box } from '@chakra-ui/react';

import { Navbar } from '@/components/Navbar';
import { TutorialPopup } from '@/components/Popup/TutorialPopup';
import RightSidePanel from '@/components/SidePanels/RightSidePanel';
import RightSidePanelToggleButton from '@/components/SidePanels/RightSidePanelToggleButton';
import SidePanelProvider from '@/components/SidePanels/SidePanelsProvider';
import Canvas from '@/features/canvas/components/Canvas';

const Home: React.FC = () => {
  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <SidePanelProvider>
        <TutorialPopup />
        <Box flex='1 0 80%'>
          <Navbar />
          <Canvas />
        </Box>
        <RightSidePanelToggleButton />
        <RightSidePanel />
      </SidePanelProvider>
    </Flex>
  );
};

export default Home;
