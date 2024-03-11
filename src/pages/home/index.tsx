import React from 'react';

import { Flex } from '@chakra-ui/react';
import 'reactflow/dist/style.css';
import Canvas from 'components/Canvas';
import LevelsProgressionProvider from 'components/levels_progression/LevelsProgressionProvider';
import IAMEntitiesProvider from 'components/nodes/IAMEntitiesProvider';
import LeftSidePanel from 'components/side_panels/LeftSidePanel';
import LeftSidePanelToggleButton from 'components/side_panels/LeftSidePanelToggleButton';
import RightSidePanel from 'components/side_panels/RightSidePanel';
import RightSidePanelToggleButton from 'components/side_panels/RightSidePanelToggleButton';
import SidePanelProvider from 'components/side_panels/SidePanelsProvider';

const Home: React.FC = () => {
  return (
    <Flex h='100vh' color='blue.100'>
      <LevelsProgressionProvider>
        <SidePanelProvider>
          <IAMEntitiesProvider>
            <LeftSidePanel />
          </IAMEntitiesProvider>
          <LeftSidePanelToggleButton />
          <Canvas />
          <RightSidePanel />
          <RightSidePanelToggleButton />
        </SidePanelProvider>
      </LevelsProgressionProvider>
    </Flex>
  );
};

export default Home;
