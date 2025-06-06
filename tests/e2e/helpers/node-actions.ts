import { Page, expect } from '@playwright/test';

import { connectNodes } from './connection-helpers';
import { findNode, findEdge } from './locator-helpers';

export class NodeActions {
  constructor(private page: Page) {}

  async expectVisible(nodeId: string): Promise<void> {
    await expect(findNode(this.page, nodeId)).toBeVisible();
  }

  async expectHidden(nodeId: string): Promise<void> {
    await expect(findNode(this.page, nodeId)).not.toBeVisible();
  }

  async expectEdgeVisible(sourceId: string, targetId: string): Promise<void> {
    await expect(findEdge(this.page, sourceId, targetId)).toBeVisible();
  }

  async connectNodes(sourceId: string, targetId: string): Promise<void> {
    await connectNodes(this.page, sourceId, targetId);
  }

  async createUserEntity(name: string, menuItemId: string, popupId: string): Promise<void> {
    await this.page.getByTestId(menuItemId).click();
    const popup = this.page.getByTestId(popupId);
    await popup.getByRole('textbox').fill(name);
    await popup.getByRole('button', { name: 'submit' }).click();
    await expect(popup).not.toBeVisible();
  }
}
