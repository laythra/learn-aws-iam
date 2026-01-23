import React from 'react';

import { Flex, Box, useTheme } from '@chakra-ui/react';

import Canvas from './Canvas';
import { GithubCorner } from '@/components/GithubCorner';
import RightSidePanel from '@/components/SidePanels/RightSidePanel';
import { UnnecessaryEdgesNodesWarning } from '@/components/UnnecessaryEdgesNodesWarning';
import { CodeEditor } from '@/features/code_editor';
import { CustomTheme } from '@/types/custom-theme';

interface CanvasContainerProps {}

const CanvasContainer: React.FC<CanvasContainerProps> = () => {
  const theme = useTheme<CustomTheme>();

  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <CodeEditor />
      <GithubCorner url='https://github.com/laythra/learnawsiam' />
      <Box h='100vh' w='100%' pt={theme.sizes.navbarHeightInPixels}>
        <Canvas />
      </Box>
      <UnnecessaryEdgesNodesWarning />
      <RightSidePanel />
    </Flex>
  );
};

export default CanvasContainer;
