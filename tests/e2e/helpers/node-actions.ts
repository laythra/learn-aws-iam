import { Page, expect } from '@playwright/test';

import { connectNodes } from './connection-helpers';
import { findNode, findEdge } from './locator-helpers';

export class NodeActions {
  constructor(private page: Page) {}

  async expectVisible(nodeId: string): Promise<void> {
    await expect(findNode(this.page, nodeId)).toBeVisible();
  }

  async expectMultipleVisible(nodeIds: string[]): Promise<void> {
    for (const nodeId of nodeIds) {
      await expect(findNode(this.page, nodeId)).toBeVisible();
    }
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
}
