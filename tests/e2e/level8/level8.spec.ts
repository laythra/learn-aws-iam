import { Page } from '@playwright/test';

import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { findNodeTagsButton } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { LEVEL_OBJECTIVES } from '@/levels/level8/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level8/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level8/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level8/tutorial_messages/popup-tutorial-messages';
import {
  PolicyNodeID,
  ResourceNodeID,
  RoleNodeID,
  UserNodeID,
} from '@/levels/level8/types/node-ids';

const completeInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  await tutorial.expectPopoverAndClickNext(
    RoleNodeID.SlackCodeDeployRole,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.SlackServiceManagePolicy,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );
};

const verifyInitialLevelSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectMultipleVisible([
    UserNodeID.JuniorBruce,
    UserNodeID.JuniorClark,
    UserNodeID.SeniorKent,
    UserNodeID.SeniorWayne,
    ResourceNodeID.SlackIntegrationSecret,
    ResourceNodeID.SlackCrashlyticsNotifierService,
    PolicyNodeID.SlackServiceManagePolicy,
    RoleNodeID.SlackCodeDeployRole,
  ]);

  await edges.expectMutlipleVisible([
    [UserNodeID.JuniorBruce, ResourceNodeID.SlackIntegrationSecret],
    [UserNodeID.JuniorBruce, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.JuniorClark, ResourceNodeID.SlackIntegrationSecret],
    [UserNodeID.JuniorClark, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.SeniorKent, ResourceNodeID.SlackIntegrationSecret],
    [UserNodeID.SeniorKent, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.SeniorWayne, ResourceNodeID.SlackIntegrationSecret],
    [UserNodeID.SeniorWayne, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.JuniorBruce, RoleNodeID.SlackCodeDeployRole],
    [UserNodeID.JuniorClark, RoleNodeID.SlackCodeDeployRole],
    [UserNodeID.SeniorKent, RoleNodeID.SlackCodeDeployRole],
    [UserNodeID.SeniorWayne, RoleNodeID.SlackCodeDeployRole],
    [PolicyNodeID.SlackServiceManagePolicy, RoleNodeID.SlackCodeDeployRole],
  ]);
};

const verifyLevelSetupAfterPolicyEdit = async (edges: EdgeActions): Promise<void> => {
  await edges.expectMutlipleVisible([
    [UserNodeID.JuniorBruce, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.JuniorClark, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.SeniorKent, ResourceNodeID.SlackIntegrationSecret],
    [UserNodeID.SeniorKent, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.SeniorWayne, ResourceNodeID.SlackIntegrationSecret],
    [UserNodeID.SeniorWayne, ResourceNodeID.SlackCrashlyticsNotifierService],
    [UserNodeID.JuniorBruce, RoleNodeID.SlackCodeDeployRole],
    [UserNodeID.JuniorClark, RoleNodeID.SlackCodeDeployRole],
    [UserNodeID.SeniorKent, RoleNodeID.SlackCodeDeployRole],
    [UserNodeID.SeniorWayne, RoleNodeID.SlackCodeDeployRole],
    [PolicyNodeID.SlackServiceManagePolicy, RoleNodeID.SlackCodeDeployRole],
  ]);

  await edges.expectMutlipleHidden([
    [UserNodeID.JuniorBruce, ResourceNodeID.SlackIntegrationSecret],
    [UserNodeID.JuniorClark, ResourceNodeID.SlackIntegrationSecret],
  ]);
};

const goThroughPopoversAfterFirstEdit = async (
  page: Page,
  tutorial: TutorialActions,
  nodes: NodeActions
): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectFixedPopoverWithTutorialGif(FIXED_POPOVER_MESSAGES[2].popover_title);
  await tutorial.expectPopoverWithoutNextButton(
    UserNodeID.JuniorBruce,
    POPOVER_TUTORIAL_MESSAGES[2].popover_title
  );

  await findNodeTagsButton(page, UserNodeID.JuniorBruce).click();
  await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[3].popover_title);
  await nodes.closeNodePopover(UserNodeID.JuniorBruce, 'tags');
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.SlackServiceManagePolicy,
    POPOVER_TUTORIAL_MESSAGES[3].popover_title
  );
};

const goThroughPopoversAfterSecondEdit = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopoverAndClickNext(
    PolicyNodeID.SlackServiceManagePolicy,
    POPOVER_TUTORIAL_MESSAGES[4].popover_title
  );

  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
};

test.describe('Stage 1 - Initial tutorial and first edit', () => {
  test('Go Through Initial Tutorial, Edit Policy, and Complete First Objective', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(8, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial tutorial', async () => {
      await completeInitialTutorial(tutorial);
    });

    await test.step('Verify initial nodes and edges visibility', async () => {
      await verifyInitialLevelSetup(nodes, edges);
    });

    await test.step('Edit policy to restrict junior users', async () => {
      await nodes.editPolicyNodeContent(
        PolicyNodeID.SlackServiceManagePolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
    });

    await test.step('Verify edges visibility after policy edit', async () => {
      await verifyLevelSetupAfterPolicyEdit(edges);
    });
  });
});

test.describe('Stage 2 - Post-first-edit tutorial popovers', () => {
  test('Complete post-edit tutorial and second policy edit', async ({
    page,
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(8, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Go through first post-edit tutorial popovers', async () => {
      await goThroughPopoversAfterFirstEdit(page, tutorial, nodes);
    });

    await test.step('Edit policy again to use tags instead of username prefix', async () => {
      await nodes.editPolicyNodeContent(
        PolicyNodeID.SlackServiceManagePolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Verify edges visibility after second policy edit', async () => {
      await verifyLevelSetupAfterPolicyEdit(edges);
    });

    await test.step('Go through second post-edit tutorial popovers', async () => {
      await goThroughPopoversAfterSecondEdit(tutorial);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    page,
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(8, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial and first policy edit', async () => {
      await completeInitialTutorial(tutorial);
      await verifyInitialLevelSetup(nodes, edges);
      await nodes.editPolicyNodeContent(
        PolicyNodeID.SlackServiceManagePolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
      await verifyLevelSetupAfterPolicyEdit(edges);
    });

    await test.step('Complete Stage 2 - Post-edit tutorial and second policy edit', async () => {
      await goThroughPopoversAfterFirstEdit(page, tutorial, nodes);
      await nodes.editPolicyNodeContent(
        PolicyNodeID.SlackServiceManagePolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
      await verifyLevelSetupAfterPolicyEdit(edges);
      await goThroughPopoversAfterSecondEdit(tutorial);
    });
  });
});
