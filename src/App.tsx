import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import ModalProvider from 'components/ModalProvider';
import IAMNodeProvider from 'components/nodes/IAMNodeProvider';
import Home from 'pages/home';
import 'App.css';

const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
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
          <Home />
        </ModalProvider>
      </IAMNodeProvider>
    </ChakraProvider>
  );
};

export default App;
