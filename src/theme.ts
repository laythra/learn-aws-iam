import '@fontsource/lato';
import { extendTheme } from '@chakra-ui/react';

import { CustomTheme } from './types/custom-theme';

export const theme: CustomTheme = extendTheme({
  styles: {
    global: {
      ':root': {
        // Used to override the default z-index of chakra's toast component
        // It should be less than the z-index of modals to show underneath them
        '--toast-z-index': '900',
      },
    },
  },
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
  components: {
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
