import React from 'react';
import { Flex } from '@chakra-ui/react';
import 'reactflow/dist/style.css';
import LeftSidePanel from 'components/side_panels/LeftSidePanel';
import RightSidePanel from 'components/side_panels/RightSidePanel';
import Canvas from 'components/Canvas';

const Home: React.FC = () => {
  return (
    <Flex h='100vh' color='blue.100'>
      <LeftSidePanel />
      <Canvas />
      <RightSidePanel />
    </Flex>
  );
};

export default Home;
