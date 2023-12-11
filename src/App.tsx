import React from 'react';
import { ChakraProvider, Flex, Text } from '@chakra-ui/react';
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Text>
          I hope this project kicks off 🤞🏻
        </Text>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
