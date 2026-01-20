import { useEffect } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from '@xyflow/react';

import { AppNavbar } from './app/AppNavbar';
import CanvasContainer from './features/canvas/components/CanvasContainer';
import IAMNodeProvider from './features/canvas/components/IAMNodeProvider';
import { initializeLevelStore } from './features/level_progress/level-operations';
import { theme } from './theme';
import ModalProvider from '@/components/ModalProvider';
import LevelsProgressionProvider from '@/components/providers/LevelsProgressionProvider';

const App: React.FC = () => {
  useEffect(() => {
    initializeLevelStore();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <IAMNodeProvider>
        <ModalProvider>
          <LevelsProgressionProvider>
            <ReactFlowProvider>
              <CanvasContainer />
              <AppNavbar />
            </ReactFlowProvider>
          </LevelsProgressionProvider>
        </ModalProvider>
      </IAMNodeProvider>
    </ChakraProvider>
  );
};

export default App;
