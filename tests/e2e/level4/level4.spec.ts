import { ENCODED_TEST_SOLUTIONS, ENCODED_LEVEL_STAGES } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/machines/level4/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level4/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level4/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level4/tutorial_messages/popup-tutorial-messages';
import { PolicyNodeID, UserNodeID, ResourceNodeID } from '@/machines/level4/types/node-id-enums';

const goThroughInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
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
  ]);
};

const completeStage1IntroTutorial = async (
  tutorial: TutorialActions,
  nodes: NodeActions
): Promise<void> => {
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.DeveloperPolicy,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );

  await nodes.openNodePopover(PolicyNodeID.DeveloperPolicy, 'content');
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.RightSidePanelToggleButton,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );
};

const editPolicyNode = async (
  nodes: NodeActions,
  nodeId: string,
  content: string
): Promise<void> => {
  await nodes.expectNodeContentButtonVisible(nodeId);
  await nodes.editPolicyNodeContent(nodeId, content);
};

const completeLevelFinishPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
};

const editPoliciesInOrder = async (
  nodes: NodeActions,
  popups: PopupActions,
  tutorial: TutorialActions,
  order: [string, string, number][]
): Promise<void> => {
  for (const [policyId, solutionKey, objectiveIndex] of order) {
    await editPolicyNode(
      nodes,
      policyId,
      await getTestSolution(ENCODED_TEST_SOLUTIONS, solutionKey)
    );
    await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[objectiveIndex].id);
  }
  await completeLevelFinishPopups(tutorial);
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

    await test.step('Introduction to policy editing task', async () => {
      await completeStage1IntroTutorial(tutorial, nodes);
    });
  });
});

test.describe('Stage 2 - Editing Policies in all orders', () => {
  test('Order 1: Developer → Data Scientist → Intern', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, popups, tutorial, [
      [PolicyNodeID.DeveloperPolicy, 'policy1', 0],
      [PolicyNodeID.DataScientistPolicy, 'policy2', 1],
      [PolicyNodeID.InternPolicy, 'policy3', 2],
    ]);
  });

  test('Order 2: Developer → Intern → Data Scientist', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, popups, tutorial, [
      [PolicyNodeID.DeveloperPolicy, 'policy1', 0],
      [PolicyNodeID.InternPolicy, 'policy3', 2],
      [PolicyNodeID.DataScientistPolicy, 'policy2', 1],
    ]);
  });

  test('Order 3: Data Scientist → Developer → Intern', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, popups, tutorial, [
      [PolicyNodeID.DataScientistPolicy, 'policy2', 1],
      [PolicyNodeID.DeveloperPolicy, 'policy1', 0],
      [PolicyNodeID.InternPolicy, 'policy3', 2],
    ]);
  });

  test('Order 4: Data Scientist → Intern → Developer', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, popups, tutorial, [
      [PolicyNodeID.DataScientistPolicy, 'policy2', 1],
      [PolicyNodeID.InternPolicy, 'policy3', 2],
      [PolicyNodeID.DeveloperPolicy, 'policy1', 0],
    ]);
  });

  test('Order 5: Intern → Developer → Data Scientist', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, popups, tutorial, [
      [PolicyNodeID.InternPolicy, 'policy3', 2],
      [PolicyNodeID.DeveloperPolicy, 'policy1', 0],
      [PolicyNodeID.DataScientistPolicy, 'policy2', 1],
    ]);
  });

  test('Order 6: Intern → Data Scientist → Developer', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, popups, tutorial, [
      [PolicyNodeID.InternPolicy, 'policy3', 2],
      [PolicyNodeID.DataScientistPolicy, 'policy2', 1],
      [PolicyNodeID.DeveloperPolicy, 'policy1', 0],
    ]);
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
      await completeStage1IntroTutorial(tutorial, nodes);
      await nodes.closeNodePopover(PolicyNodeID.DeveloperPolicy, 'content');
    });

    await test.step('Complete Stage 2 - Edit all policies and finish level', async () => {
      await editPolicyNode(
        nodes,
        PolicyNodeID.DeveloperPolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0].id);

      await editPolicyNode(
        nodes,
        PolicyNodeID.DataScientistPolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1].id);

      await editPolicyNode(
        nodes,
        PolicyNodeID.InternPolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3')
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[2].id);

      await completeLevelFinishPopups(tutorial);
    });
  });
});
