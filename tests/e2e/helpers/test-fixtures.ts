import { test as base } from '@playwright/test';

import { EdgeActions } from './edge-actions';
import { PopupActions } from './popup-actions';
import { loadLevelStage } from './test-solutions';
import { NodeActions } from '../helpers/node-actions';
import { TutorialActions } from '../helpers/tutorial-actions';

type TestFixtures = {
  tutorial: TutorialActions;
  nodes: NodeActions;
  edges: EdgeActions;
  popups: PopupActions;
  goToLevel: (levelNumber: number) => Promise<void>;
  goToLevelAtStage: <K extends string>(
    levelNumber: number,
    levelStages: Record<K, () => Promise<string | undefined>>,
    stageName: K
  ) => Promise<void>;
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

  edges: async ({ page }, use) => {
    const edges = new EdgeActions(page);
    await use(edges);
  },

  popups: async ({ page }, use) => {
    const popups = new PopupActions(page);
    await use(popups);
  },

  goToLevel: async ({ page }, use) => {
    const goToLevel = async (levelNumber: number): Promise<void> => {
      page.addInitScript(level => {
        window.localStorage.setItem(`learn_aws_iam_currentLevel`, level.toString());
      }, levelNumber);
    };

    await use(goToLevel);
  },

  goToLevelAtStage: async ({ page, goToLevel }, use) => {
    const goToLevelStage = async <K extends string>(
      levelNumber: number,
      levelStages: Record<K, () => Promise<string | undefined>>,
      stageName: K
    ): Promise<void> => {
      await goToLevel(levelNumber);
      const snapshot = await loadLevelStage(levelStages, stageName);
      await page.addInitScript(
        ([snapshotData, level]) => {
          window.localStorage.setItem(`learn_aws_iam_level${level}StateCheckpoint`, snapshotData);
        },
        [snapshot, levelNumber] as [string, number]
      );

      await page.goto('http://localhost:5173');
    };

    await use(goToLevelStage);
  },
});

export { expect } from '@playwright/test';
