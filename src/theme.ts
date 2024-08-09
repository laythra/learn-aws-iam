import '@fontsource/lato';
import { extendTheme, type Theme } from '@chakra-ui/react';

interface CustomTheme extends Theme {
  sizes: Theme['sizes'] & {
    iamNodeWidthInPixels: number;
  };
  fonts: Theme['fonts'] & {
    heading: string;
    body: string;
  };
}

export const theme: CustomTheme = extendTheme({
  fonts: {
    heading: `Lato, sans-serif`,
    body: `Lato, sans-serif`,
  },
  sizes: {
    iamNodeWidthInPixels: 225,
  },
}) as CustomTheme;
