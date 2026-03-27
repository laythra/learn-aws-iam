import { test as base } from '@playwright/test';

import { EdgeActions } from './edge-actions';
import { EntityCreationActions } from './entity-creation-actions';
import { LevelProgressActions } from './level-progress-actions';
import { loadLevelStage } from './test-solutions';
import { UIActions } from './ui-actions';
import { NodeActions } from '../helpers/node-actions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { LEVEL_VERSIONS } from '@/levels/level-versions';

type TestFixtures = {
  tutorial: TutorialActions;
  nodes: NodeActions;
  edges: EdgeActions;
  entities: EntityCreationActions;
  progress: LevelProgressActions;
  ui: UIActions;
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

  entities: async ({ page }, use) => {
    const entities = new EntityCreationActions(page);
    await use(entities);
  },

  progress: async ({ page }, use) => {
    const progress = new LevelProgressActions(page);
    await use(progress);
  },

  ui: async ({ page }, use) => {
    const ui = new UIActions(page);
    await use(ui);
  },

  goToLevel: async ({ page }, use) => {
    const goToLevel = async (levelNumber: number): Promise<void> => {
      page.addInitScript(level => {
        window.localStorage.setItem(`currentLevel`, level.toString());
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
      const versioned = snapshot
        ? JSON.stringify({ version: LEVEL_VERSIONS[levelNumber], snapshot: JSON.parse(snapshot) })
        : undefined;
      await page.addInitScript(
        ([snapshotData, level]) => {
          if (snapshotData) {
            window.localStorage.setItem(`level${level}StateCheckpoint`, snapshotData);
          }
        },
        [versioned, levelNumber] as [string | undefined, number]
      );

      await page.goto('http://localhost:5173');
    };

    await use(goToLevelStage);
  },
});

export { expect } from '@playwright/test';
