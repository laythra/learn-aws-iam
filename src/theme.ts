import '@fontsource/lato';
import { extendTheme } from '@chakra-ui/react';

import { CustomTheme } from './types/custom-theme';

export const theme: CustomTheme = extendTheme({
  fonts: {
    heading: `Lato, sans-serif`,
    body: `Lato, sans-serif`,
  },
  sizes: {
    iamNodeWidthInPixels: 225,
    iamNodeHeightInPixels: 82,
    modalsMaxWidthInPixels: 720,
    navbarHeightInPixels: 65,
    codeEditorHeightInPixels: 500,
    sidePanelWidthInPixels: window.innerWidth * 0.2,
  },
}) as CustomTheme;
