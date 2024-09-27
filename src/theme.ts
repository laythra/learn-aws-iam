import '@fontsource/lato';
import { extendTheme } from '@chakra-ui/react';

import type { CustomTheme } from './types';

export const theme: CustomTheme = extendTheme({
  fonts: {
    heading: `Lato, sans-serif`,
    body: `Lato, sans-serif`,
  },
  sizes: {
    iamNodeWidthInPixels: 225,
    iamNodeHeightInPixels: 75,
    modalsMaxWidthInPixels: 720,
    navbarHeightInPixels: 65,
  },
}) as CustomTheme;
