import { Page, expect } from '@playwright/test';

import { findInsufficientPermissionsToast } from './locator-helpers';
import { ElementID } from '@/config/element-ids';

export class UIActions {
  constructor(private readonly page: Page) {}

  async expectUnnecessaryEdgesNodesWarning(isVisible: boolean): Promise<void> {
    const warning = this.page.getByTestId('unnecessary-edges-nodes-warning');

    if (isVisible) {
      await expect(warning).toBeVisible();
    } else {
      await expect(warning).not.toBeVisible();
    }
  }

  async closeSidePanel(): Promise<void> {
    const toggleButton = this.page.getByTestId(ElementID.RightSidePanelToggleButton);
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();
  }

  async expectInsufficientPermissionsWarning(): Promise<void> {
    const warning = findInsufficientPermissionsToast(this.page);
    await expect(warning).toBeVisible();
  }
}
