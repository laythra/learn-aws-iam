import { useEffect } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from '@xyflow/react';

import { AppNavbar } from '@/app_shell/AppNavbar';
import { AppOverlays } from '@/app_shell/AppOverlays';
import ModalProvider from '@/components/ModalProvider';
import LevelsProgressionProvider from '@/components/providers/LevelsProgressionProvider';
import CanvasContainer from '@/features/canvas/components/CanvasContainer';
import { initializeLevelStore } from '@/features/level_progress/level-operations';
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
            <CanvasContainer />
            <AppNavbar />
            <AppOverlays />
          </ReactFlowProvider>
        </LevelsProgressionProvider>
      </ModalProvider>
    </ChakraProvider>
  );
};

export default App;
