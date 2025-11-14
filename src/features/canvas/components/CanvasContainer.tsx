import React from 'react';

import { Flex, Box, useTheme } from '@chakra-ui/react';

import Canvas from './Canvas';
import { GithubCorner } from '@/components/GithubCorner';
import { HelpButton } from '@/components/HelpComponents/HelpButton';
import { HelpPopover } from '@/components/HelpComponents/HelpPopover';
import { Navbar } from '@/components/Navbar';
import { FixedPopover } from '@/components/Popover/FixedPopover';
import { MobileWarningPopup } from '@/components/Popup/MobileWarningPopup';
import { TutorialPopup } from '@/components/Popup/TutorialPopup';
import RightSidePanel from '@/components/SidePanels/RightSidePanel';
import { UnnecessaryEdgesNodesWarning } from '@/components/UnnecessaryEdgesNodesWarning';
import { CodeEditor } from '@/features/code_editor';
import { CustomTheme } from '@/types';

interface CanvasContainerProps {}

const CanvasContainer: React.FC<CanvasContainerProps> = () => {
  const theme = useTheme<CustomTheme>();

  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <CodeEditor />
      <GithubCorner />
      <TutorialPopup />
      <MobileWarningPopup />
      <Navbar />
      <HelpButton />
      <HelpPopover />
      <Box h='100vh' w='100%' pt={theme.sizes.navbarHeightInPixels}>
        <Canvas />
      </Box>
      <FixedPopover />
      <UnnecessaryEdgesNodesWarning />
      <RightSidePanel />
    </Flex>
  );
};

export default CanvasContainer;
