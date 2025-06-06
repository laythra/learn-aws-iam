import { Page } from '@playwright/test';

import { findPopover } from './locator-helpers';

export const assertPopoverIsVisible = async (
  page: Page,
  nodeId: string,
  popoverTitle: string
): Promise<void> => {
  const popover = await findPopover(page, nodeId, popoverTitle).waitFor();

  expect(popover).toBeVisible();
};
