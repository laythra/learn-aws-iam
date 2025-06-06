import { test as base } from '@playwright/test';

import { NodeActions } from '../helpers/node-actions';
import { TutorialActions } from '../helpers/tutorial-actions';

type TestFixtures = {
  tutorial: TutorialActions;
  nodes: NodeActions;
};

export const test = base.extend<TestFixtures>({
  tutorial: async ({ page }, use) => {
    const tutorial = new TutorialActions(page);
    await use(tutorial);
  },

  nodes: async ({ page }, use) => {
    const nodes = new NodeActions(page);
    await use(nodes);
  },
});

export { expect } from '@playwright/test';
