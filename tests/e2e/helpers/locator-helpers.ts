import { Locator, Page } from '@playwright/test';

import { getEdgeName } from '../../../src/utils/names';
import { ElementID } from '@/config/element-ids';

export const findNode = (page: Page, nodeId: string): Locator => {
  return page.getByTestId(nodeId);
};

export const findPopover = (page: Page, popoverId: string, title: string): Locator => {
  return page.getByTestId(`popover-${popoverId}`).filter({ hasText: title });
};

export const findEdge = (page: Page, sourceNode: string, targetNode: string): Locator => {
  const edgeName = getEdgeName(sourceNode, targetNode);
  return page.getByTestId(edgeName);
};

/**
 * Finds a tutorial popup by its title.
 * Tutorial popups are used to guide users through the application,
 * and they usually have a hardcoded title, and a `Next` button.
 * @param page
 * @param popupTitle
 * @returns
 */
export const findTutorialPopup = (page: Page, popupTitle: string): Locator => {
  return page.getByRole('dialog').filter({ hasText: popupTitle });
};

/**
 * Finds an operational popup by its test ID.
 * Test IDs are used for better developer experience,
 * since operational popups don't have hardcoded titles, unlike tutorial popups.
 * @param page - The Playwright page object
 * @param popupId - The test ID of the popup to find
 * @returns Locator for the operational popup
 */
export const findOperationalPopup = (page: Page, popupId: string): Locator => {
  return page.getByTestId(popupId);
};

export const findNodeButton = (page: Page, buttonTestId: string): Locator => {
  return page.getByTestId(buttonTestId);
};

export const fixedFixedPopover = (page: Page, popoverTitle: string): Locator => {
  return page.getByRole('dialog').filter({ hasText: popoverTitle });
};

export const findNodeTagsButton = (page: Page, nodeId: string): Locator => {
  return findNode(page, nodeId).getByTestId(ElementID.IAMNodeTagsButton);
};

export const findNodeArnButton = (page: Page, nodeId: string): Locator => {
  return findNode(page, nodeId).getByTestId(ElementID.IAMNodeArnButton);
};

export const findNodeContentButton = (page: Page, nodeId: string): Locator => {
  return findNode(page, nodeId).getByTestId(ElementID.IAMNodeContentButton);
};

export const findNodePopover = (
  page: Page,
  nodeId: string,
  popoverType: 'content' | 'arn' | 'tags'
): Locator => {
  return page.getByTestId(`${nodeId}-${popoverType}`);
};
