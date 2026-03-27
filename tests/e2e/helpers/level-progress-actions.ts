import { Locator, Page, expect } from '@playwright/test';

import { findObjectiveCompleteToast } from './locator-helpers';

export class LevelProgressActions {
  constructor(private readonly page: Page) {}

  async expectLevelObjectiveCompleteToast(objectiveDescription: string): Promise<Locator> {
    const toast = findObjectiveCompleteToast(this.page, objectiveDescription);
    await expect(toast).toBeVisible();

    return toast;
  }

  async expectLevelObjectiveCompleteToastAndClose(objectiveDescription: string): Promise<void> {
    const toast = findObjectiveCompleteToast(this.page, objectiveDescription);
    await expect(toast).toBeVisible();
    await toast.getByRole('button', { name: 'close' }).click();
    await expect(toast).not.toBeVisible();
  }
}
