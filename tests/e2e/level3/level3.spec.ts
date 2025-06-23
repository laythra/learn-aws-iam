import { expect } from '@playwright/test';

import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { findNodeContentButton, findNodePopover } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { ElementID } from '@/config/element-ids';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level3/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level3/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level3/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  ResourceNodeID,
  UserNodeID,
} from '@/machines/level3/types/node-id-enums';

test.describe('Stage 1 - Initial Tutorial Flow', () => {
  test('Initial Tutorial Flow', async ({ tutorial, page, nodes, goToLevelAtStage }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Go through initial popups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
    });

    await test.step('Go through initial fixed popovers', async () => {
      await nodes.expectVisible(PolicyNodeID.S3ReadPolicy);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.S3ReadPolicy,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );

      await expect(page.getByTestId(ElementID.NewEntityBtn)).not.toBeVisible();

      await findNodeContentButton(page, PolicyNodeID.S3ReadPolicy).click();
      await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[0].popover_title);
      await nodes.closeNodePopover(PolicyNodeID.S3ReadPolicy, 'content');

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
    });

    await test.step('Should find initial nodes and edges visible', async () => {
      await nodes.expectVisible(ResourceNodeID.PublicImagesS3Bucket);
      await tutorial.expectPopoverWithoutNextButton(
        ResourceNodeID.PublicImagesS3Bucket,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });
  });
});

test.describe('Stage 2 - ARNs and Policy Creation Workflow', () => {
  test('Copy ARN from the resource node and create a new permission policy', async ({
    page,
    goToLevelAtStage,
    nodes,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('copy resource node ARN', async () => {
      await nodes.openNodePopover(ResourceNodeID.PublicImagesS3Bucket, 'arn');
      const copyARNButton = findNodePopover(page, ResourceNodeID.PublicImagesS3Bucket, 'arn');
      await copyARNButton.getByRole('button', { name: 'copy' }).click();
      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[2].popover_title
      );
    });

    await test.step('Creates new permission policy', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 's3_read_policy')
      );

      await nodes.expectVisible(PolicyNodeID.S3ReadPolicy);
      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.S3ReadPolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });
  });
});

test.describe('Stage 3 - Creating new nodes and edges', () => {
  const verifyFinalState = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
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
  };

  // Test case 1: Create policies first, then connect them (original order)
  test('Policy creation workflow: create all policies first, then connect to groups', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Go through the tutorial popups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });

    await test.step('Assert initial nodes and edges', async () => {
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
    });

    await test.step('Create all policies first, then connect them', async () => {
      // Create all policies first
      for (const policyKey of [
        's3_read_write_policy',
        'dynamo_db_read_write_policy',
        'cloudfront_read_policy',
      ]) {
        await popups.submitCreatePolicyPopup(
          [ElementID.CodeEditorPolicyTab],
          ElementID.CodeEditorPolicyTab,
          `TestPolicy${policyKey}`,
          getTestSolution(ENCODED_TEST_SOLUTIONS, policyKey)
        );
      }

      // Then connect them all to groups
      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);
      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);
      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);

      await verifyFinalState(nodes, edges);
    });
  });

  // Test case 2: Create and connect each policy immediately (interleaved approach)
  test('Policy creation workflow: create and connect each policy immediately', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Go through the tutorial popups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });

    await test.step('Create and connect policies one at a time', async () => {
      // S3 Policy: Create then connect immediately
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 's3_read_write_policy')
      );
      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);

      // DynamoDB Policy: Create then connect immediately
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'cloudfront_read_policy')
      );
      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);

      // CloudFront Policy: Create then connect immediately
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'dynamo_db_read_write_policy')
      );
      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);

      await verifyFinalState(nodes, edges);
    });
  });

  // Test case 3: Create policies in reverse order, connect in forward order
  test('Policy creation workflow: create policies in reverse order, connect forward', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Go through the tutorial popups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });

    await test.step('Create policies in reverse order, connect in forward order', async () => {
      // Create policies in reverse order (CloudFront, DynamoDB, S3)
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'dynamo_db_read_write_policy')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'cloudfront_read_policy')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 's3_read_write_policy')
      );

      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);
      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);
      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);

      await verifyFinalState(nodes, edges);
    });
  });

  // Test case 4: Create policies in random order, connect in reverse order
  test('Policy creation workflow: create random order, connect in reverse order', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Go through the tutorial popups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });

    await test.step('Create policies in mixed order, connect in reverse order', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'cloudfront_read_policy')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 's3_read_write_policy')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'dynamo_db_read_write_policy')
      );

      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);
      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);
      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);

      await verifyFinalState(nodes, edges);
    });
  });

  // Test case 5: Mixed creation and connection pattern
  test('Policy creation workflow: mixed creation-connection pattern', async ({
    goToLevelAtStage,
    nodes,
    edges,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(3, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Go through the tutorial popups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });

    await test.step('Create and connect in complex mixed pattern', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy4',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'dynamo_db_read_write_policy')
      );
      await nodes.connectNodes(PolicyNodeID.DynamoDBReadWritePolicy, GroupNodeID.BackendGroup);

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 's3_read_write_policy')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy3',
        getTestSolution(ENCODED_TEST_SOLUTIONS, 'cloudfront_read_policy')
      );

      await nodes.connectNodes(PolicyNodeID.S3ReadWritePolicy, GroupNodeID.FrontendGroup);
      await nodes.connectNodes(PolicyNodeID.CloudFrontReadPolicy, GroupNodeID.FrontendGroup);

      await verifyFinalState(nodes, edges);
    });
  });
});
