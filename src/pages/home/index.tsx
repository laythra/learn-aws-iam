import React from 'react';

import { Flex, Box } from '@chakra-ui/react';

import { Navbar } from '@/components/Navbar';
import { TutorialPopup } from '@/components/Popup/TutorialPopup';
import RightSidePanel from '@/components/SidePanels/RightSidePanel';
import RightSidePanelToggleButton from '@/components/SidePanels/RightSidePanelToggleButton';
import Canvas from '@/features/canvas/components/Canvas';

const Home: React.FC = () => {
  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <TutorialPopup />
      <Box flex='1 1 80%'>
        <Navbar />
        <Canvas />
      </Box>
      <RightSidePanelToggleButton />
      <RightSidePanel />
    </Flex>
  );
};

export default Home;
