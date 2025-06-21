import { ENCODED_TEST_SOLUTIONS } from './data';
import { findNodeTagsButton } from '../helpers/locator-helpers';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level8/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level8/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level8/tutorial_messages/popup-tutorial-messages';
import {
  PolicyNodeID,
  ResourceNodeID,
  RoleNodeID,
  UserNodeID,
} from '@/machines/level8/types/node-id-enums';

test.describe('Level 8', () => {
  test('Goes through the entirety of level 8', async ({
    page,
    tutorial,
    nodes,
    edges,
    goToLevel,
  }) => {
    await test.step('Open Level 8', async () => {
      await goToLevel(8);
      await page.goto('http://localhost:5173');
    });

    await test.step('Initial Popups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
    });

    await test.step('Initial tutorial popovers', async () => {
      await tutorial.expectPopoverAndClickNext(
        RoleNodeID.SlackCodeDeployRole,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.SlackServiceManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });

    await test.step('Check initial nodes and edges visibility', async () => {
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
    });

    await test.step('Edit Policy', async () => {
      await nodes.editPolicyNodeContent(
        PolicyNodeID.SlackServiceManagePolicy,
        getTestSolution(ENCODED_TEST_SOLUTIONS, '1')
      );
    });

    await test.step('Check edges visibility after policy edit', async () => {
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
    });

    await test.step('Go through post-edit popovers', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectPopoverWithoutNextButton(
        UserNodeID.JuniorBruce,
        POPOVER_TUTORIAL_MESSAGES[2].popover_title
      );

      await findNodeTagsButton(page, UserNodeID.JuniorBruce).click();
      await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[2].popover_title);
      await nodes.closeNodePopover(UserNodeID.JuniorBruce, 'tags');
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.SlackServiceManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Edit Policy', async () => {
      nodes.editPolicyNodeContent(
        PolicyNodeID.SlackServiceManagePolicy,
        getTestSolution(ENCODED_TEST_SOLUTIONS, '2')
      );
    });

    await test.step('Check edges visibility after policy edit', async () => {
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
    });

    await test.step('Finish level 8', async () => {
      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.SlackServiceManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );

      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
    });
  });
});
