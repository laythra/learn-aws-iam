import React from 'react';

import { Flex, Box, useTheme } from '@chakra-ui/react';

import Canvas from './Canvas';
import { GithubCorner } from '@/components/GithubCorner';
import { HelpButton } from '@/components/HelpComponents/HelpButton';
import { HelpPopover } from '@/components/HelpComponents/HelpPopover';
import { Navbar } from '@/components/Navbar';
import { FixedPopover } from '@/components/Popover/FixedPopover';
import { ObjectiveCompleteToast } from '@/components/Popover/ObjectiveCompleteToast';
import { MobileWarningPopup } from '@/components/Popup/MobileWarningPopup';
import { TutorialPopup } from '@/components/Popup/TutorialPopup';
import RightSidePanel from '@/components/SidePanels/RightSidePanel';
import { UnnecessaryEdgesNodesWarning } from '@/components/UnnecessaryEdgesNodesWarning';
import { CodeEditor } from '@/features/code_editor';
import { NavbarPopoverProvider } from '@/hooks/useNavbarPopover';
import { CustomTheme } from '@/types/custom-theme';

interface CanvasContainerProps {}

const CanvasContainer: React.FC<CanvasContainerProps> = () => {
  const theme = useTheme<CustomTheme>();

  return (
    <Flex direction='row' h='100vh' w='100vw'>
      <CodeEditor />
      <GithubCorner />
      <TutorialPopup />
      <MobileWarningPopup />
      <NavbarPopoverProvider>
        <Navbar />
      </NavbarPopoverProvider>
      <HelpButton />
      <HelpPopover />
      <Box h='100vh' w='100%' pt={theme.sizes.navbarHeightInPixels}>
        <Canvas />
      </Box>
      <FixedPopover />
      <UnnecessaryEdgesNodesWarning />
      <ObjectiveCompleteToast />
      <RightSidePanel />
    </Flex>
  );
};

export default CanvasContainer;
