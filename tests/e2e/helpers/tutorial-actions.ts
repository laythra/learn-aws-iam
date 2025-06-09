import { Page, expect } from '@playwright/test';

import { findPopover, findTutorialPopup, fixedFixedPopover } from './locator-helpers';

export class TutorialActions {
  constructor(private page: Page) {}

  async expectPopoverAndClickNext(nodeId: string, title: string): Promise<void> {
    const popover = findPopover(this.page, nodeId, title);
    await expect(popover).toBeVisible();
    await popover.getByRole('button', { name: /next/i }).click();
  }

  async expectTutorialPopupAndClickNext(title: string): Promise<void> {
    const popup = findTutorialPopup(this.page, title);
    await expect(popup).toBeVisible();
    await popup.getByRole('button', { name: /next/i }).click();
    await expect(popup).not.toBeVisible();
  }

  async expectFixedPopoverAndClickNext(title: string): Promise<void> {
    const fixedPopover = fixedFixedPopover(this.page, title);
    await expect(fixedPopover).toBeVisible();
    await fixedPopover.getByRole('button', { name: /next/i }).click();
  }

  async expectPopoverWithoutNextButton(nodeId: string, title: string): Promise<void> {
    const popover = findPopover(this.page, nodeId, title);
    await expect(popover).toBeVisible();
    await expect(popover.getByRole('button', { name: /next/i })).toHaveCount(0);
  }

  async goThroughConsecutivePopovers(
    steps: Array<{ nodeId: string; title: string }>
  ): Promise<void> {
    for (const step of steps) {
      await this.expectPopoverAndClickNext(step.nodeId, step.title);
    }
  }

  async clickGlobalNextButton(): Promise<void> {
    await this.page.getByRole('button', { name: /next/i }).click();
  }
}
