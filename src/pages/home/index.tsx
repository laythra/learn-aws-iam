import React from 'react';

import { Flex, Box } from '@chakra-ui/react';

import Canvas from '@/components/Canvas/Canvas';
import { Navbar } from '@/components/Navbar';
import { TutorialPopup } from '@/components/Popup/TutorialPopup';
import RightSidePanel from '@/components/side_panels/RightSidePanel';
import RightSidePanelToggleButton from '@/components/side_panels/RightSidePanelToggleButton';
import SidePanelProvider from '@/components/side_panels/SidePanelsProvider';

const Home: React.FC = () => {
  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <TutorialPopup />
      <Box flex='1 0 80%'>
        <Navbar />
        <Canvas />
      </Box>
      <SidePanelProvider>
        <RightSidePanelToggleButton />
        <RightSidePanel />
      </SidePanelProvider>
    </Flex>
  );
};

export default Home;
