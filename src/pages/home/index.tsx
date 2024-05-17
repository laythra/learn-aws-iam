import React from 'react';

import { Flex } from '@chakra-ui/react';

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
    <Flex h='100vh' color='blue.100'>
      <BackgroundOverlay isOpen={isTutorialActive} />
      <SidePanelProvider>
        <IAMEntitiesProvider>
          <LeftSidePanel />
        </IAMEntitiesProvider>
        <LeftSidePanelToggleButton />
        <Canvas />
        <RightSidePanel />
        <RightSidePanelToggleButton />
      </SidePanelProvider>
    </Flex>
  );
};

export default Home;
