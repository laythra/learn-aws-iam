import { Page, expect } from '@playwright/test';

import { findPopover, findTutorialPopup, findFixedPopover } from './locator-helpers';
import { ElementID } from '@/config/element-ids';
export class TutorialActions {
  constructor(private readonly page: Page) {}

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

  async expectPopupWithGoToNextLevelButton(title: string): Promise<void> {
    const popup = findTutorialPopup(this.page, title);
    await expect(popup).toBeVisible();
    await expect(popup.getByTestId('go-to-next-level-button')).toBeVisible();
  }

  async expectFixedPopoverAndClickNext(title: string): Promise<void> {
    const fixedPopover = findFixedPopover(this.page, title);
    await expect(fixedPopover).toBeVisible();
    await fixedPopover.getByRole('button', { name: /next/i }).click();
  }

  async expectFixedPopoverWithTutorialGif(title: string): Promise<void> {
    const fixedPopover = findFixedPopover(this.page, title);
    await expect(fixedPopover).toBeVisible();
    await expect(fixedPopover.getByTestId('help-image-gif')).toBeVisible();
  }

  async expectFixedPopoverWithTutorialGifAndClickNext(title: string): Promise<void> {
    await this.expectFixedPopoverWithTutorialGif(title);
    const fixedPopover = findFixedPopover(this.page, title);
    await fixedPopover.getByRole('button', { name: /next/i }).click();
  }

  async expectPopoverWithoutNextButton(nodeId: string, title: string): Promise<void> {
    const popover = findPopover(this.page, nodeId, title);
    await expect(popover).toBeVisible();
    await expect(popover.getByRole('button', { name: /next/i })).toHaveCount(0);
  }

  async expectFixedPopoverWithoutNextButton(title: string): Promise<void> {
    const fixedPopover = findFixedPopover(this.page, title);
    await expect(fixedPopover).toBeVisible();
    await expect(fixedPopover.getByRole('button', { name: /next/i })).toHaveCount(0);
  }

  async closePopover(nodeId: string, title: string): Promise<void> {
    const popover = findPopover(this.page, nodeId, title);
    await expect(popover).toBeVisible();

    await popover.getByRole('button', { name: /close/i }).click();
    await expect(popover).not.toBeVisible();
  }

  async expectUnnecessaryEdgesNodesWarning(isVisible: boolean): Promise<void> {
    const warning = this.page.getByTestId('unnecessary-edges-nodes-warning');
    isVisible ? await expect(warning).toBeVisible() : await expect(warning).not.toBeVisible();
  }

  async closeSidePanel(): Promise<void> {
    const toggleButton = this.page.getByTestId(ElementID.RightSidePanelToggleButton);
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();
  }
}
