import React from 'react';

import { Flex, Box } from '@chakra-ui/react';

import Canvas from '@/components/Canvas';
import { Navbar } from '@/components/Navbar';
import RightSidePanel from '@/components/side_panels/RightSidePanel';
import RightSidePanelToggleButton from '@/components/side_panels/RightSidePanelToggleButton';
import SidePanelProvider from '@/components/side_panels/SidePanelsProvider';

const Home: React.FC = () => {
  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <Box flex='1 0 80%' transition='flex 0.5s ease'>
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
