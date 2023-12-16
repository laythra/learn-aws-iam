import React, { useCallback } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import 'reactflow/dist/style.css';
import LeftSidePanel from 'components/side_panels/LeftSidePanel';
import Canvas from 'components/Canvas';

const Home: React.FC = () => {
  return (
    <Flex h="100vh" color="blue.100">
      <LeftSidePanel />
      <Canvas />
    </Flex >
  )
}

export default Home;
