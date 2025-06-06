import { Locator, Page } from '@playwright/test';

import { getEdgeName } from '../../../src/utils/names';

export const findNode = (page: Page, nodeId: string): Locator => {
  return page.getByTestId(`${nodeId}`);
};

export const findPopover = (page: Page, popoverId: string, title: string): Locator => {
  return page.getByTestId(`popover-${popoverId}`).filter({ hasText: title });
};

export const findEdge = (page: Page, sourceNode: string, targetNode: string): Locator => {
  const edgeName = getEdgeName(sourceNode, targetNode);
  return page.getByTestId(edgeName);
};

export const findPopup = (page: Page, popupId: string): Locator => {
  return page.getByTestId(popupId);
};
