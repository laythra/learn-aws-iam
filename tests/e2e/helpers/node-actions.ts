import { Page, expect } from '@playwright/test';

import { connectNodes } from './connection-helpers';
import {
  findNode,
  findEdge,
  findOperationalPopup,
  findNodeContentButton,
  findNodeTagsButton,
  findNodeArnButton,
  findNodePopover,
  findUnnecessaryNode,
} from './locator-helpers';
import { ElementID } from '@/config/element-ids';

export class NodeActions {
  constructor(private readonly page: Page) {}

  async expectVisible(...nodeId: string[]): Promise<void> {
    for (const id of nodeId) {
      await expect(findNode(this.page, id)).toBeVisible();
    }
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

  async openNodePopover(nodeId: string, popoverType: 'content' | 'tags' | 'arn'): Promise<void> {
    switch (popoverType) {
      case 'content':
        await findNodeContentButton(this.page, nodeId).click();
        break;
      case 'tags':
        await findNodeTagsButton(this.page, nodeId).click();
        break;
      case 'arn':
        await findNodeArnButton(this.page, nodeId).click();
        break;
      default:
        throw new Error(`Unknown popover type: ${popoverType}`);
    }
  }

  async closeNodePopover(nodeId: string, popoverType: 'content' | 'tags'): Promise<void> {
    await findNodePopover(this.page, nodeId, popoverType)
      .getByRole('button', { name: 'close' })
      .click();

    await expect(findNodePopover(this.page, nodeId, popoverType)).not.toBeVisible();
  }

  async editPolicyNodeContent(nodeId: string, newContent: string): Promise<void> {
    await this.openNodePopover(nodeId, 'content');
    const contentPopover = findNodePopover(this.page, nodeId, 'content');
    await expect(contentPopover).toBeVisible();
    const editButton = contentPopover.getByTestId(ElementID.IAMNodeContentEditButton);
    await expect(editButton).toBeVisible();
    await editButton.click();

    const codeEditorPopup = findOperationalPopup(this.page, ElementID.CodeEditorPopup);

    await expect(codeEditorPopup).toBeVisible();

    const codeEditorTextarea = codeEditorPopup.getByRole('textbox').first();

    await codeEditorTextarea.clear();
    await codeEditorTextarea.fill(newContent);

    const submitButton = codeEditorPopup.getByRole('button', { name: 'Submit' });

    // wait for debounced button (500ms delay) to become clickable
    await expect(submitButton).toBeEnabled({ timeout: 1000 });

    await submitButton.click();
  }

  async deleteNode(nodeId: string): Promise<void> {
    const node = findNode(this.page, nodeId);
    await expect(node).toBeVisible();

    await node.click();
    await this.page.keyboard.press('Backspace');
  }

  async expectNodeContentButtonVisible(nodeId: string): Promise<void> {
    await expect(findNodeContentButton(this.page, nodeId)).toBeVisible();
  }

  async deleteUnnecessaryNode(): Promise<void> {
    const unnecessaryNode = findUnnecessaryNode(this.page);
    const unnecessaryNodeId = await unnecessaryNode.getAttribute('data-element-id');
    await this.deleteNode(unnecessaryNodeId!);
  }
}
