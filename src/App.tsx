import { ChakraProvider } from '@chakra-ui/react';
import Home from 'pages/home';
import 'App.css';

function App() {
  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  );
}

export default App;
