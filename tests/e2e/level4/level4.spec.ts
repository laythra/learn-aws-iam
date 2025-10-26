import { ENCODED_TEST_SOLUTIONS, ENCODED_LEVEL_STAGES } from './data';
import { NodeActions } from '../helpers/node-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level4/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level4/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level4/tutorial_messages/popup-tutorial-messages';
import { PolicyNodeID, UserNodeID, ResourceNodeID } from '@/machines/level4/types/node-id-enums';

test.describe('Stage 1 - Policy Mastery Exam Introduction', () => {
  test('Initial Tutorial Flow', async ({ tutorial, nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
    });

    await test.step('Navigate through fixed popovers introducing policy editing', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
    });

    await test.step('Verify initial level setup with users, policies, and resources', async () => {
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

      // Verify initial policy-to-user connections
      await edges.expectVisible(PolicyNodeID.DeveloperPolicy, UserNodeID.Developer1);
      await edges.expectVisible(PolicyNodeID.DeveloperPolicy, UserNodeID.Developer2);
      await edges.expectVisible(PolicyNodeID.DataScientistPolicy, UserNodeID.DataScientist1);
      await edges.expectVisible(PolicyNodeID.InternPolicy, UserNodeID.Intern1);
      await edges.expectVisible(PolicyNodeID.InternPolicy, UserNodeID.Intern2);
    });

    await test.step('Introduction to policy editing task', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.DeveloperPolicy,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );

      await nodes.openNodePopover(PolicyNodeID.DeveloperPolicy, 'content');
      await tutorial.expectPopoverWithoutNextButton(
        ElementID.RightSidePanelToggleButton,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });
  });
});

test.describe('Stage 2 - Editing Policies in all orders', () => {
  const editPolicyNode = async (
    nodes: NodeActions,
    nodeId: string,
    content: string
  ): Promise<void> => {
    // Developer Policy content popover is already open from tutorial, skip opening
    await nodes.expectNodeContentButtonVisible(nodeId);
    await nodes.editPolicyNodeContent(nodeId, content);
  };

  const expectLevelFinalMessages = async (tutorial: TutorialActions): Promise<void> => {
    await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
    await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  };

  const editPoliciesInOrder = async (
    nodes: NodeActions,
    tutorial: TutorialActions,
    order: [string, string][]
  ): Promise<void> => {
    for (const [policyId, solutionKey] of order) {
      await editPolicyNode(
        nodes,
        policyId,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, solutionKey)
      );
    }
    await expectLevelFinalMessages(tutorial);
  };

  test('Order 1: Developer → Data Scientist → Intern', async ({
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, tutorial, [
      [PolicyNodeID.DeveloperPolicy, 'policy1'],
      [PolicyNodeID.DataScientistPolicy, 'policy2'],
      [PolicyNodeID.InternPolicy, 'policy3'],
    ]);
  });

  test('Order 2: Developer → Intern → Data Scientist', async ({
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, tutorial, [
      [PolicyNodeID.DeveloperPolicy, 'policy1'],
      [PolicyNodeID.InternPolicy, 'policy3'],
      [PolicyNodeID.DataScientistPolicy, 'policy2'],
    ]);
  });

  test('Order 3: Data Scientist → Developer → Intern', async ({
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, tutorial, [
      [PolicyNodeID.DataScientistPolicy, 'policy2'],
      [PolicyNodeID.DeveloperPolicy, 'policy1'],
      [PolicyNodeID.InternPolicy, 'policy3'],
    ]);
  });

  test('Order 4: Data Scientist → Intern → Developer', async ({
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, tutorial, [
      [PolicyNodeID.DataScientistPolicy, 'policy2'],
      [PolicyNodeID.InternPolicy, 'policy3'],
      [PolicyNodeID.DeveloperPolicy, 'policy1'],
    ]);
  });

  test('Order 5: Intern → Developer → Data Scientist', async ({
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, tutorial, [
      [PolicyNodeID.InternPolicy, 'policy3'],
      [PolicyNodeID.DeveloperPolicy, 'policy1'],
      [PolicyNodeID.DataScientistPolicy, 'policy2'],
    ]);
  });

  test('Order 6: Intern → Data Scientist → Developer', async ({
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage2');
    await editPoliciesInOrder(nodes, tutorial, [
      [PolicyNodeID.InternPolicy, 'policy3'],
      [PolicyNodeID.DataScientistPolicy, 'policy2'],
      [PolicyNodeID.DeveloperPolicy, 'policy1'],
    ]);
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    tutorial,
    nodes,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(4, ENCODED_LEVEL_STAGES, 'stage1');

    // Complete initial tutorial
    await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
    await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
    await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
    await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
    await tutorial.expectPopoverWithoutNextButton(
      PolicyNodeID.DeveloperPolicy,
      POPOVER_TUTORIAL_MESSAGES[0].popover_title
    );
    await nodes.openNodePopover(PolicyNodeID.DeveloperPolicy, 'content');
    await tutorial.expectPopoverWithoutNextButton(
      ElementID.RightSidePanelToggleButton,
      POPOVER_TUTORIAL_MESSAGES[1].popover_title
    );

    await nodes.closeNodePopover(PolicyNodeID.DeveloperPolicy, 'content');

    // Edit all policies
    const policyEditOrders: [string, string][] = [
      [PolicyNodeID.DeveloperPolicy, 'policy1'],
      [PolicyNodeID.DataScientistPolicy, 'policy2'],
      [PolicyNodeID.InternPolicy, 'policy3'],
    ];

    for (const [policyId, solutionKey] of policyEditOrders) {
      await nodes.expectNodeContentButtonVisible(policyId);
      await nodes.editPolicyNodeContent(
        policyId,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, solutionKey)
      );
    }

    // Final tutorial messages
    await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
    await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  });
});
