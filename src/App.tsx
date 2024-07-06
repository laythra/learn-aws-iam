import { ChakraProvider, extendTheme, ThemeOverride, type ThemeConfig } from '@chakra-ui/react';

import LevelsProgressionProvider from './components/levels_progression/LevelsProgressionProvider';
import { theme } from './theme';
import IAMNodeProvider from '@/components/Canvas/IAMNodeProvider';
import ModalProvider from '@/components/ModalProvider';
import Home from '@/pages/home';

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
