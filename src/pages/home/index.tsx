import React from 'react';

import { Flex, Box } from '@chakra-ui/react';

import { Navbar } from '@/components/Navbar';

import 'reactflow/dist/style.css';
import Canvas from '@/components/Canvas';
import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider'; // eslint-disable-line
import IAMEntitiesProvider from '@/components/nodes/IAMEntitiesProvider';
import { BackgroundOverlay } from '@/components/Popover/BackgroundOverlay';
import LeftSidePanel from '@/components/side_panels/LeftSidePanel';
import LeftSidePanelToggleButton from '@/components/side_panels/LeftSidePanelToggleButton';
import RightSidePanel from '@/components/side_panels/RightSidePanel';
import RightSidePanelToggleButton from '@/components/side_panels/RightSidePanelToggleButton';
import SidePanelProvider from '@/components/side_panels/SidePanelsProvider';

const Home: React.FC = () => {
  const isTutorialActive = LevelsProgressionContext.useSelector(
    state => state.context.state_name === 'inside_tutorial'
  );

  return (
    <Flex direction='row' h='100vh'>
      <Box width='80%'>
        <Navbar />
        <BackgroundOverlay isOpen={isTutorialActive} />
        {/* <SidePanelProvider> */}
        {/* <IAMEntitiesProvider> */}
        {/* <LeftSidePanel /> */}
        {/* </IAMEntitiesProvider> */}
        {/* <LeftSidePanelToggleButton /> */}
        <Canvas />
        {/* <RightSidePanelToggleButton /> */}
        {/* </SidePanelProvider> */}
      </Box>
      <Box width='20%'>
        <RightSidePanel />
      </Box>
    </Flex>
  );
};

export default Home;
