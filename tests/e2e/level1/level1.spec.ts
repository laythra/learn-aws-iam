import { TUTORIAL_STEPS } from './tutorial-steps';
import { test, expect } from '../helpers/test-fixtures';
import { ElementID } from '@/config/element-ids';
// prettier-ignore
import {
  POPOVER_TUTORIAL_MESSAGES
} from '@/machines/level1/tutorial_messages/popover-tutorial-messages';
// prettier-ignore
import {
  POPUP_TUTORIAL_MESSAGES
} from '@/machines/level1/tutorial_messages/popup-tutorial-messages';
import { UserNodeID, ResourceNodeID, PolicyNodeID } from '@/machines/level1/types/node-id-enums';

test.describe('Level 1 Tutorial Phase', () => {
  test('Goes through the tutorial phase', async ({ page, tutorial, nodes }) => {
    // Setup
    await page.goto('http://localhost:5173');

    // Initial popup
    await tutorial.expectPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].id!);

    // Check initial node visibility
    await nodes.expectVisible(UserNodeID.TutorialUser);
    await nodes.expectHidden(ResourceNodeID.PublicImagesS3Bucket);
    await nodes.expectHidden(PolicyNodeID.S3ReadPolicy);

    // Go through initial user popovers
    await tutorial.goThroughConsecutivePopovers(TUTORIAL_STEPS.INITIAL_USER_POPOVERS);

    // Check S3 bucket appears
    await nodes.expectVisible(ResourceNodeID.PublicImagesS3Bucket);
    await nodes.expectHidden(PolicyNodeID.S3ReadPolicy);

    // Continue tutorial
    await tutorial.clickGlobalNextButton();
    await nodes.expectVisible(PolicyNodeID.S3ReadPolicy);
    await tutorial.clickGlobalNextButton();

    // Connect policy to user
    await nodes.connectNodes(PolicyNodeID.S3ReadPolicy, UserNodeID.TutorialUser);
    await nodes.expectEdgeVisible(PolicyNodeID.S3ReadPolicy, UserNodeID.TutorialUser);
    await nodes.expectEdgeVisible(UserNodeID.TutorialUser, ResourceNodeID.PublicImagesS3Bucket);

    // Access granted popover
    await tutorial.expectPopoverAndClickNext(
      UserNodeID.TutorialUser,
      POPOVER_TUTORIAL_MESSAGES[6].popover_title
    );

    // Create new entity
    const newEntityBtn = page.getByTestId(ElementID.NewEntityBtn);
    await expect(newEntityBtn).toBeVisible();
    await newEntityBtn.click();

    await nodes.createUserEntity(
      'TestUser',
      ElementID.CreateEntitiesMenuItem,
      ElementID.IAMIdentityCreatorPopup
    );

    // Verify new user created
    await nodes.expectVisible(UserNodeID.FirstUser);

    // Tutorial for new user
    await tutorial.expectPopoverWithoutNextButton(
      UserNodeID.FirstUser,
      POPOVER_TUTORIAL_MESSAGES[9].popover_title
    );

    await nodes.connectNodes(PolicyNodeID.S3ReadPolicy, UserNodeID.FirstUser);
    await nodes.expectEdgeVisible(PolicyNodeID.S3ReadPolicy, UserNodeID.FirstUser);
    await nodes.expectEdgeVisible(UserNodeID.FirstUser, ResourceNodeID.PublicImagesS3Bucket);

    await tutorial.goThroughConsecutivePopovers(TUTORIAL_STEPS.FINAL_POPOVERS);

    await tutorial.expectPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].id!);
  });
});
