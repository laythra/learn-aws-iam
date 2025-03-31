import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';

import CanvasContainer from './features/canvas/components/CanvasContainer';
import IAMNodeProvider from './features/canvas/components/IAMNodeProvider';
import { theme } from './theme';
import ModalProvider from '@/components/ModalProvider';
import LevelsProgressionProvider from '@/components/providers/LevelsProgressionProvider';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <IAMNodeProvider>
        <ModalProvider>
          <LevelsProgressionProvider>
            <ReactFlowProvider>
              <CanvasContainer />
            </ReactFlowProvider>
          </LevelsProgressionProvider>
        </ModalProvider>
      </IAMNodeProvider>
    </ChakraProvider>
  );
};

export default App;
