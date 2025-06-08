import { Page, expect } from '@playwright/test';

import { findOperationalPopup } from './locator-helpers';
import { ElementID } from '@/config/element-ids';

export class PopupActions {
  constructor(private page: Page) {}

  async expectVisible(popupId: string): Promise<void> {
    await expect(findOperationalPopup(this.page, popupId)).toBeVisible();
  }

  async submitCreateEntityPopup(name: string, menuItemId: string, popupId: string): Promise<void> {
    const newEntityBtn = this.page.getByTestId(ElementID.NewEntityBtn);
    await expect(newEntityBtn).toBeVisible();
    await newEntityBtn.click();
    await this.page.getByTestId(menuItemId).click();
    const popup = this.page.getByTestId(popupId);
    await popup.getByRole('textbox').fill(name);
    await popup.getByRole('button', { name: 'submit' }).click();
    await expect(popup).not.toBeVisible();
  }
}
