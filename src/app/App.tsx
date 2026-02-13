import { useEffect } from 'react';

import { ChakraProvider, Flex } from '@chakra-ui/react';
import { ReactFlowProvider } from '@xyflow/react';

import { AppNavbar } from '@/app_shell/AppNavbar';
import { AppOverlays } from '@/app_shell/AppOverlays';
import { initializeLevelStore } from '@/app_shell/runtime/level-operations';
import LevelsProgressionProvider from '@/app_shell/runtime/LevelsProgressionProvider';
import { GithubCorner } from '@/components/GithubCorner';
import Canvas from '@/features/canvas/components/Canvas';
import { CodeEditorSystem } from '@/features/code_editor/CodeEditorSystem';
import { IdentityCreationPopup } from '@/features/iam_entities/components/IdentityCreationPopup';
import { ObjectiveCompleteToast } from '@/features/level_progress/components/ObjectiveCompleteToast';
import ObjectivesSidePanel from '@/features/level_progress/components/ObjectivesSidePanel';
import { TutorialPopup } from '@/features/level_progress/components/TutorialPopup';
import { UnnecessaryEdgesNodesWarning } from '@/features/level_progress/components/UnnecessaryEdgesNodesWarning';
import { ModalProvider } from '@/hooks/useModal';
import { theme } from '@/theme';

const App: React.FC = () => {
  useEffect(() => {
    initializeLevelStore();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <ModalProvider>
        <LevelsProgressionProvider>
          <ReactFlowProvider>
            <IdentityCreationPopup />
            <AppNavbar />
            <AppOverlays />
            <ObjectiveCompleteToast />
            <TutorialPopup />
            <GithubCorner url='https://github.com/laythra/learnawsiam' />
            <CodeEditorSystem />
            <UnnecessaryEdgesNodesWarning />
            <Flex direction='row' h='100vh' w='100vw'>
              <Canvas />
              <ObjectivesSidePanel />
            </Flex>
          </ReactFlowProvider>
        </LevelsProgressionProvider>
      </ModalProvider>
    </ChakraProvider>
  );
};

export default App;
