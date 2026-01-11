import { Page } from '@playwright/test';

import { findNode } from './locator-helpers';
import { HandleID } from '@/types/iam-enums';

export const connectNodes = async (
  page: Page,
  sourceNode: string,
  targetNode: string,
  sourceHandleID: HandleID,
  targetHandleID: HandleID
): Promise<void> => {
  const sourceHandle = findNode(page, sourceNode).locator(
    `.react-flow__handle[data-handleid="${sourceHandleID}"]`
  );

  const targetHandle = findNode(page, targetNode).locator(
    `.react-flow__handle[data-handleid="${targetHandleID}"]`
  );

  const sourceBox = await sourceHandle.boundingBox();
  const targetBox = await targetHandle.boundingBox();

  if (sourceBox && targetBox) {
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
    await page.mouse.up();
  } else {
    throw new Error(`Could not find bounding boxes for nodes: ${sourceNode} or ${targetNode}`);
  }
};
