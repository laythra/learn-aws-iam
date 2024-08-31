import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';

import IAMNodeProvider from './features/canvas/components/IAMNodeProvider';
import { theme } from './theme';
import ModalProvider from '@/components/ModalProvider';
import LevelsProgressionProvider from '@/components/providers/LevelsProgressionProvider';
import Home from '@/pages/home';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <IAMNodeProvider>
        <ModalProvider>
          <LevelsProgressionProvider>
            <ReactFlowProvider>
              <Home />
            </ReactFlowProvider>
          </LevelsProgressionProvider>
        </ModalProvider>
      </IAMNodeProvider>
    </ChakraProvider>
  );
};

export default App;
