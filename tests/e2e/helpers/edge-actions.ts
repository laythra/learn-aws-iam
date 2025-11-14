import { Page, expect } from '@playwright/test';

import { findEdge } from './locator-helpers';

export class EdgeActions {
  constructor(private page: Page) {}

  /**
   * Expects an edge between two nodes to be visible.
   * @param sourceId - The ID of the source node.
   * @param targetId - The ID of the target node.
   */
  async expectVisible(sourceId: string, targetId: string): Promise<void> {
    const edge = findEdge(this.page, sourceId, targetId);

    // For thin/vertical edges, just check they exist and have proper opacity
    // playwright won't detect the edge using `toBeVisible()`
    await expect(edge).toHaveCount(1);
    await expect(edge).toHaveCSS('opacity', '1');
  }

  /**
   * Expects an edge between two nodes to be hidden.
   * @param sourceId - The ID of the source node.
   * @param targetId - The ID of the target node.
   */
  async expectHidden(sourceId: string, targetId: string): Promise<void> {
    const edge = findEdge(this.page, sourceId, targetId);

    await expect(edge).toHaveCount(0);
  }

  /**
   * Expects multiple edges to be visible.
   * @param edges - Array of edges represented as tuples of source and target node IDs.
   * Each tuple should be in the format [sourceId, targetId].
   */
  async expectMutlipleVisible(edges: Array<[string, string]>): Promise<void> {
    for (const [from, to] of edges) {
      await this.expectVisible(from, to);
    }
  }

  /**
   * Expects multiple edges to be hidden.
   * @param edges - Array of edges represented as tuples of source and target node IDs.
   * Each tuple should be in the format [sourceId, targetId].
   */
  async expectMutlipleHidden(edges: Array<[string, string]>): Promise<void> {
    for (const [from, to] of edges) {
      await this.expectHidden(from, to);
    }
  }

  /**
   * Deletes the connection edge between two nodes.
   * @param sourceId - The ID of the source node.
   * @param targetId - The ID of the target node.
   */
  async deleteEdge(sourceId: string, targetId: string): Promise<void> {
    const edge = findEdge(this.page, sourceId, targetId);

    await edge.click({ force: true });
    await this.page.keyboard.press('Backspace');
  }
}
