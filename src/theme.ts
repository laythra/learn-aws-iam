import '@fontsource/ibm-plex-sans';
import '@fontsource/ibm-plex-mono';
import { extendTheme } from '@chakra-ui/react';

import { CustomTheme } from './types/custom-theme';

export const theme: CustomTheme = extendTheme({
  fonts: {
    heading: `'IBM Plex Sans', sans-serif`,
    body: `'IBM Plex Sans', sans-serif`,
    mono: `'IBM Plex Mono', monospace`,
  },
  sizes: {
    iamNodeWidthInPixels: 225,
    iamNodeHeightInPixels: 82,
    modalsMaxWidthInPixels: 720,
    navbarHeightInPixels: 65,
    codeEditorHeightInPixels: 500,
    sidePanelWidthInPixels: window.innerWidth * 0.2,
  },
  zIndices: {
    modal: 9000,
  },
  components: {
    Tooltip: {
      baseStyle: {
        zIndex: 10000,
      },
    },
    Popover: {
      baseStyle: {
        popper: { zIndex: 1000 },
      },
      variants: {
        elevated: {
          popper: { zIndex: 1100 },
        },
      },
    },
  },
}) as CustomTheme;
