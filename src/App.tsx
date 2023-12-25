import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import NodeProvider from 'components/nodes/NodeProvider';
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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <NodeProvider>
        <Home />
      </NodeProvider>
    </ChakraProvider>
  );
}

export default App;
