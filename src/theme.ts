import '@fontsource/lato';
import { extendTheme } from '@chakra-ui/react';

import { CustomTheme } from './types/custom-theme';

export enum PopoverElementID {
  NewEntityBtn = 'new-entity-btn',
  IAMIdentityNameInput = 'iam-identity-name',
  IAMIdentitySelectorTypeForCreation = 'iam-identity-selector-type-for-creation',
  CreateEntitiesMenuItem = 'create-entities-menu-item',
  CreateRolesAndPoliciesMenuItem = 'create-roles-and-policies-menu-item',
}

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
  },
}) as CustomTheme;
