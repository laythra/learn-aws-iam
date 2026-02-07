import { expect, Page } from '@playwright/test';

import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { findNodeContentButton, findNodePopover } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level3/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level3/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level3/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level3/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  ResourceNodeID,
  UserNodeID,
} from '@/levels/level3/types/node-id-enums';

const goThroughInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
};

const completeStage1IntroTutorial = async (
  tutorial: TutorialActions,
  nodes: NodeActions,
  page: Page
): Promise<void> => {
  await nodes.expectVisible(PolicyNodeID.S3ListBucketsPolicy);
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.S3ListBucketsPolicy,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );

  await expect(page.getByTestId(ElementID.NewEntityBtn)).not.toBeVisible();

  await findNodeContentButton(page, PolicyNodeID.S3ListBucketsPolicy).click();
  await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[0].popover_title);
  await nodes.closeNodePopover(PolicyNodeID.S3ListBucketsPolicy, 'content');

  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
  await tutorial.expectFixedPopoverWithTutorialGif(FIXED_POPOVER_MESSAGES[3].popover_title);

  await nodes.expectVisible(ResourceNodeID.PublicImagesS3Bucket);
  await tutorial.expectPopoverWithoutNextButton(
    ResourceNodeID.PublicImagesS3Bucket,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );
};

const copyResourceARN = async (
  nodes: NodeActions,
  tutorial: TutorialActions,
  page: Page
): Promise<void> => {
  await nodes.openNodePopover(ResourceNodeID.PublicImagesS3Bucket, 'arn');
  const copyARNButton = findNodePopover(page, ResourceNodeID.PublicImagesS3Bucket, 'arn');
  await copyARNButton.getByRole('button', { name: 'copy' }).click();
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[2].popover_title
  );
};

const createFirstPolicy = async (popups: PopupActions, nodes: NodeActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'TestPolicy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
  );

  await nodes.expectVisible(PolicyNodeID.S3ReadPolicy);
};

const completeStage3IntroTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
};

const verifyStage3InitialSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectMultipleVisible([
    ResourceNodeID.PublicAssetsS3Bucket,
    ResourceNodeID.DynamoDBTable,
    ResourceNodeID.CloudFront,
    GroupNodeID.BackendGroup,
    GroupNodeID.FrontendGroup,
    UserNodeID.Ali,
    UserNodeID.Laith,
    UserNodeID.Mohammad,
    UserNodeID.Khalid,
  ]);

  await edges.expectMutlipleVisible([
    [UserNodeID.Laith, GroupNodeID.FrontendGroup],
    [UserNodeID.Ali, GroupNodeID.FrontendGroup],
    [UserNodeID.Mohammad, GroupNodeID.BackendGroup],
    [UserNodeID.Khalid, GroupNodeID.BackendGroup],
  ]);
};

const createAllPolicies = async (popups: PopupActions): Promise<void> => {
  for (const policyKey of ['policy2', 'policy3', 'policy4']) {
    await popups.submitCreatePolicyPopup(
      [ElementID.CodeEditorPolicyTab],
      ElementID.CodeEditorPolicyTab,
      `TestPolicy${policyKey}`,
      await getTestSolution(ENCODED_TEST_SOLUTIONS, policyKey)
    );
  }
};

const connectAllPoliciesToGroups = async (
  nodes: NodeActions,
  popups: PopupActions
): Promise<void> => {
  await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);

  await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);

  await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
};

const verifyFinalState = async (
  nodes: NodeActions,
  edges: EdgeActions,
  tutorial: TutorialActions
): Promise<void> => {
  await nodes.expectMultipleVisible([
    PolicyNodeID.DynamoDBReadWritePolicy,
    PolicyNodeID.CloudFrontReadPolicy,
    PolicyNodeID.S3ReadWritePolicy,
  ]);

  await edges.expectMutlipleVisible([
    [PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup],
    [PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup],
    [PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup],
    [UserNodeID.Laith, ResourceNodeID.PublicAssetsS3Bucket],
    [UserNodeID.Ali, ResourceNodeID.PublicAssetsS3Bucket],
    [UserNodeID.Mohammad, ResourceNodeID.DynamoDBTable],
    [UserNodeID.Khalid, ResourceNodeID.DynamoDBTable],
    [UserNodeID.Laith, ResourceNodeID.CloudFront],
    [UserNodeID.Ali, ResourceNodeID.CloudFront],
  ]);

  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[5].title);
};

test.describe('Stage 1 - Initial Tutorial Flow', () => {
  test('Complete initial tutorial and introduction to policies', async ({
    tutorial,
    page,
    nodes,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Go through initial popups', async () => {
      await goThroughInitialTutorial(tutorial);
    });

    await test.step('Go through initial fixed popovers and verify nodes', async () => {
      await completeStage1IntroTutorial(tutorial, nodes, page);
    });
  });
});

test.describe('Stage 2 - ARNs and Policy Creation Workflow', () => {
  test('Copy ARN from resource node and create permission policy', async ({
    page,
    goToLevelAtStage,
    nodes,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Copy resource node ARN', async () => {
      await copyResourceARN(nodes, tutorial, page);
    });

    await test.step('Create new permission policy', async () => {
      await createFirstPolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.S3ReadPolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });
  });
});

test.describe('Stage 3 - Creating Multiple Policies and Connections', () => {
  test('Create all policies first, then connect to groups', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete tutorial popups', async () => {
      await completeStage3IntroTutorial(tutorial);
    });

    await test.step('Verify initial setup', async () => {
      await verifyStage3InitialSetup(nodes, edges);
    });

    await test.step('Create all policies first, then connect them', async () => {
      await createAllPolicies(popups);
      await connectAllPoliciesToGroups(nodes, popups);
      await verifyFinalState(nodes, edges, tutorial);
    });
  });

  test('Create and connect each policy immediately', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete tutorial popups', async () => {
      await completeStage3IntroTutorial(tutorial);
    });

    await test.step('Create and connect policies one at a time', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3')
      );
      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy4')
      );
      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);

      await verifyFinalState(nodes, edges, tutorial);
    });
  });

  test('Create policies in reverse order, connect in forward order', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete tutorial popups', async () => {
      await completeStage3IntroTutorial(tutorial);
    });

    await test.step('Create policies in reverse order, connect in forward order', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy4')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );

      await connectAllPoliciesToGroups(nodes, popups);
      await verifyFinalState(nodes, edges, tutorial);
    });
  });

  test('Create random order, connect in reverse order', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete tutorial popups', async () => {
      await completeStage3IntroTutorial(tutorial);
    });

    await test.step('Create policies in mixed order, connect in reverse order', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy4')
      );

      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);

      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);

      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);

      await verifyFinalState(nodes, edges, tutorial);
    });
  });

  test('Mixed creation-connection pattern', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete tutorial popups', async () => {
      await completeStage3IntroTutorial(tutorial);
    });

    await test.step('Create and connect in complex mixed pattern', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy4')
      );
      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3')
      );

      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);

      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);

      await verifyFinalState(nodes, edges, tutorial);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete full level flow from start to finish', async ({
    page,
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial and policy introduction', async () => {
      await goThroughInitialTutorial(tutorial);
      await completeStage1IntroTutorial(tutorial, nodes, page);
    });

    await test.step('Complete Stage 2 - ARN copy and first policy creation', async () => {
      await copyResourceARN(nodes, tutorial, page);
      await createFirstPolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.S3ReadPolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Complete Stage 3 - Create and connect policies', async () => {
      await completeStage3IntroTutorial(tutorial);
      await verifyStage3InitialSetup(nodes, edges);
      await createAllPolicies(popups);
      await connectAllPoliciesToGroups(nodes, popups);
      await verifyFinalState(nodes, edges, tutorial);
    });
  });
});
