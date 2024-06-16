import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';

import LevelsProgressionProvider from './components/levels_progression/LevelsProgressionProvider';
import ModalProvider from '@/components/ModalProvider';
import IAMNodeProvider from '@/components/nodes/IAMNodeProvider';
import Home from '@/pages/home';

const theme: ThemeConfig = extendTheme({
  styles: {
    global: {
      '*': {
        color: 'black',
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <IAMNodeProvider>
        <ModalProvider>
          <LevelsProgressionProvider>
            <Home />
          </LevelsProgressionProvider>
        </ModalProvider>
      </IAMNodeProvider>
    </ChakraProvider>
  );
};

export default App;
