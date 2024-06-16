import React, { ReactElement } from 'react';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { ThemeProvider } from '@emotion/react';

const theme = extendTheme({
  // Customize your theme here
});

export const decorators = [
  Story => (
    <ChakraProvider>
      <Story />
    </ChakraProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
