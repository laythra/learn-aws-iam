import type { Theme } from '@chakra-ui/react';

export interface CustomTheme extends Theme {
  sizes: Theme['sizes'] & {
    iamNodeWidthInPixels: number;
    iamNodeHeightInPixels: number;
  };
  fonts: Theme['fonts'] & {
    heading: string;
    body: string;
  };
}
