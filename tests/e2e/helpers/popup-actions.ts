import { Page, expect } from '@playwright/test';

import { findObjectiveCompleteToast, findOperationalPopup } from './locator-helpers';
import { CodeEditorTabsElementID, ElementID } from '@/config/element-ids';

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

  async submitCreatePolicyPopup(
    expectedVisibleTabs: CodeEditorTabsElementID[],
    targetTab: CodeEditorTabsElementID,
    policyName: string,
    policyContent: string,
    accountId?: string
  ): Promise<void> {
    const newEntityBtn = this.page.getByTestId(ElementID.NewEntityBtn);
    await expect(newEntityBtn).toBeVisible();
    await newEntityBtn.click();
    await this.page.getByTestId(ElementID.CreateRolesAndPoliciesMenuItem).click();

    const popup = findOperationalPopup(this.page, ElementID.CodeEditorPopup);

    await expect(popup).toBeVisible();
    for (const tab of expectedVisibleTabs) {
      await expect(this.page.getByTestId(tab)).toBeVisible();
    }

    await this.page.getByTestId(targetTab).click();
    const nameField = popup.getByRole('textbox').first();
    const editField = popup.getByRole('textbox').last();
    await nameField.fill(policyName);

    // CodeMirror (editor) is not a real textarea; fill() can append instead of replace content
    await editField.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await popup.getByRole('textbox').last().fill(policyContent);

    if (accountId) {
      const accountDropdown = popup.getByTestId(ElementID.AccountSelectionDropdown);
      await accountDropdown.selectOption(accountId);
    }

    await popup.getByRole('button', { name: 'submit' }).click();
    await expect(popup).not.toBeVisible();
  }

  async expectLevelObjectiveCompleteToastAndClose(objectiveDescription: string): Promise<void> {
    const toast = findObjectiveCompleteToast(this.page, objectiveDescription);
    await expect(toast).toBeVisible();
    await toast.getByRole('button', { name: 'close' }).click();
    await expect(toast).not.toBeVisible();
  }
}
