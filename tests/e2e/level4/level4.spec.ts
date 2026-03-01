import { ENCODED_TEST_SOLUTIONS, ENCODED_LEVEL_STAGES } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level4/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level4/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level4/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level4/tutorial_messages/popup-tutorial-messages';
import { PolicyNodeID, UserNodeID, ResourceNodeID } from '@/levels/level4/types/node-id-enums';

const goThroughInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
  await tutorial.expectPopoverAndClickNext(
    ElementID.RightSidePanelToggleButton,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );
  await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[3].popover_title);
};

const verifyLevelInitialSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectVisible(
    PolicyNodeID.DeveloperPolicy,
    PolicyNodeID.DataScientistPolicy,
    PolicyNodeID.InternPolicy,
    UserNodeID.Developer1,
    UserNodeID.Developer2,
    UserNodeID.DataScientist1,
    UserNodeID.Intern1,
    UserNodeID.Intern2,
    ResourceNodeID.CustomerDataDynamoTable,
    ResourceNodeID.AnalyticsDataDynamoTable,
    ResourceNodeID.TimeshiftAssetsS3Bucket
  );

  await edges.expectMutlipleVisible([
    [PolicyNodeID.DeveloperPolicy, UserNodeID.Developer1],
    [PolicyNodeID.DeveloperPolicy, UserNodeID.Developer2],
    [PolicyNodeID.DataScientistPolicy, UserNodeID.DataScientist1],
    [PolicyNodeID.InternPolicy, UserNodeID.Intern1],
    [PolicyNodeID.InternPolicy, UserNodeID.Intern2],
    [UserNodeID.Developer1, ResourceNodeID.CustomerDataDynamoTable],
    [UserNodeID.Developer2, ResourceNodeID.CustomerDataDynamoTable],
    [UserNodeID.DataScientist1, ResourceNodeID.AnalyticsDataDynamoTable],
  ]);

  await edges.expectMutlipleHidden([
    [UserNodeID.Developer1, ResourceNodeID.TimeshiftAssetsS3Bucket],
    [UserNodeID.Developer2, ResourceNodeID.TimeshiftAssetsS3Bucket],
    [UserNodeID.Developer1, ResourceNodeID.AnalyticsDataDynamoTable],
    [UserNodeID.Developer2, ResourceNodeID.AnalyticsDataDynamoTable],
    [UserNodeID.DataScientist1, ResourceNodeID.TimeshiftAssetsS3Bucket],
    [UserNodeID.Intern1, ResourceNodeID.TimeshiftAssetsS3Bucket],
    [UserNodeID.Intern2, ResourceNodeID.TimeshiftAssetsS3Bucket],
  ]);
};

const editPolicyNode = async (
  nodes: NodeActions,
  nodeId: string,
  content: string
): Promise<void> => {
  await nodes.expectNodeContentButtonVisible(nodeId);
  await nodes.editPolicyNodeContent(nodeId, content);
};

const editDeveloperPolicyNode = async (
  nodes: NodeActions,
  edges: EdgeActions,
  popups: PopupActions
): Promise<void> => {
  const content = await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1');
  await editPolicyNode(nodes, PolicyNodeID.DeveloperPolicy, content);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0].id);
  await edges.expectMutlipleVisible([
    [PolicyNodeID.DeveloperPolicy, UserNodeID.Developer1],
    [PolicyNodeID.DeveloperPolicy, UserNodeID.Developer2],
    [UserNodeID.Developer1, ResourceNodeID.CustomerDataDynamoTable],
    [UserNodeID.Developer2, ResourceNodeID.CustomerDataDynamoTable],
    [UserNodeID.Developer1, ResourceNodeID.TimeshiftAssetsS3Bucket],
    [UserNodeID.Developer2, ResourceNodeID.TimeshiftAssetsS3Bucket],
  ]);
};

const editDataScientistPolicyNode = async (
  nodes: NodeActions,
  edges: EdgeActions,
  popups: PopupActions
): Promise<void> => {
  const content = await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2');
  await editPolicyNode(nodes, PolicyNodeID.DataScientistPolicy, content);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1].id);
  await edges.expectMutlipleVisible([
    [PolicyNodeID.DataScientistPolicy, UserNodeID.DataScientist1],
    [UserNodeID.DataScientist1, ResourceNodeID.AnalyticsDataDynamoTable],
    [UserNodeID.DataScientist1, ResourceNodeID.TimeshiftAssetsS3Bucket],
  ]);

  await edges.expectHidden(UserNodeID.DataScientist1, ResourceNodeID.CustomerDataDynamoTable);
};

const editInternPolicyNode = async (
  nodes: NodeActions,
  edges: EdgeActions,
  popups: PopupActions
): Promise<void> => {
  const content = await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3');
  await editPolicyNode(nodes, PolicyNodeID.InternPolicy, content);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[2].id);
  await edges.expectMutlipleVisible([
    [PolicyNodeID.InternPolicy, UserNodeID.Intern1],
    [PolicyNodeID.InternPolicy, UserNodeID.Intern2],
    [UserNodeID.Intern1, ResourceNodeID.TimeshiftAssetsS3Bucket],
    [UserNodeID.Intern2, ResourceNodeID.TimeshiftAssetsS3Bucket],
  ]);
};

const goToStage2AndDismissTutorial = async (
  tutorial: TutorialActions,
  goToLevelAtStage: <K extends string>(
    level: number,
    stages: Record<K, () => Promise<string | undefined>>,
    stage: K
  ) => Promise<void>
): Promise<void> => {
  await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
  await tutorial.expectFixedPopoverWithTutorialGif(FIXED_POPOVER_MESSAGES[3].popover_title);
  await tutorial.closeFixedPopovers();
};

const completeLevelFinishPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
};

test.describe('Stage 1 - Policy Mastery Exam Introduction', () => {
  test('Initial Tutorial Flow', async ({ tutorial, nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial', async () => {
      await goThroughInitialTutorial(tutorial);
    });

    await test.step('Verify initial level setup with users, policies, and resources', async () => {
      await verifyLevelInitialSetup(nodes, edges);
    });
  });
});

test.describe('Stage 2 - Editing Policies in all orders', () => {
  test('Order 1: Developer → Data Scientist → Intern', async ({
    nodes,
    edges,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToStage2AndDismissTutorial(tutorial, goToLevelAtStage);

    await editDeveloperPolicyNode(nodes, edges, popups);
    await editDataScientistPolicyNode(nodes, edges, popups);
    await editInternPolicyNode(nodes, edges, popups);
  });

  test('Order 2: Developer → Intern → Data Scientist', async ({
    nodes,
    edges,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToStage2AndDismissTutorial(tutorial, goToLevelAtStage);

    await editDeveloperPolicyNode(nodes, edges, popups);
    await editInternPolicyNode(nodes, edges, popups);
    await editDataScientistPolicyNode(nodes, edges, popups);
  });

  test('Order 3: Data Scientist → Developer → Intern', async ({
    nodes,
    edges,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToStage2AndDismissTutorial(tutorial, goToLevelAtStage);

    await editDataScientistPolicyNode(nodes, edges, popups);
    await editDeveloperPolicyNode(nodes, edges, popups);
    await editInternPolicyNode(nodes, edges, popups);
  });

  test('Order 4: Data Scientist → Intern → Developer', async ({
    nodes,
    edges,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await goToStage2AndDismissTutorial(tutorial, goToLevelAtStage);

    await editDataScientistPolicyNode(nodes, edges, popups);
    await editInternPolicyNode(nodes, edges, popups);
    await editDeveloperPolicyNode(nodes, edges, popups);
  });

  test('Order 5: Intern → Developer → Data Scientist', async ({
    nodes,
    edges,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToStage2AndDismissTutorial(tutorial, goToLevelAtStage);

    await editInternPolicyNode(nodes, edges, popups);
    await editDeveloperPolicyNode(nodes, edges, popups);
    await editDataScientistPolicyNode(nodes, edges, popups);
  });

  test('Order 6: Intern → Data Scientist → Developer', async ({
    nodes,
    edges,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToStage2AndDismissTutorial(tutorial, goToLevelAtStage);

    await editInternPolicyNode(nodes, edges, popups);
    await editDataScientistPolicyNode(nodes, edges, popups);
    await editDeveloperPolicyNode(nodes, edges, popups);
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial and policy introduction', async () => {
      await goThroughInitialTutorial(tutorial);
      await verifyLevelInitialSetup(nodes, edges);
      await tutorial.closeFixedPopovers();
    });

    await test.step('Complete Stage 2 - Edit all policies and finish level', async () => {
      await editDeveloperPolicyNode(nodes, edges, popups);
      await editDataScientistPolicyNode(nodes, edges, popups);
      await editInternPolicyNode(nodes, edges, popups);

      await completeLevelFinishPopups(tutorial);
    });
  });
});
