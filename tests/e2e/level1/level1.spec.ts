import { test } from '../helpers/test-fixtures';
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
  test('Goes through the tutorial phase', async ({
    page,
    tutorial,
    nodes,
    edges,
    popups,
    goToLevel,
  }) => {
    await goToLevel(1);
    await page.goto('http://localhost:5173');

    // Initial popup
    await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);

    // Check initial node visibility
    await nodes.expectVisible(UserNodeID.TutorialUser);
    await nodes.expectHidden(ResourceNodeID.PublicImagesS3Bucket);
    await nodes.expectHidden(PolicyNodeID.S3ReadPolicy);

    // Go through initial user popovers
    await tutorial.expectPopoverAndClickNext(
      UserNodeID.TutorialUser,
      POPOVER_TUTORIAL_MESSAGES[0].popover_title
    );
    await tutorial.expectPopoverAndClickNext(
      UserNodeID.TutorialUser,
      POPOVER_TUTORIAL_MESSAGES[1].popover_title
    );
    await tutorial.expectPopoverAndClickNext(
      UserNodeID.TutorialUser,
      POPOVER_TUTORIAL_MESSAGES[2].popover_title
    );

    // Check S3 bucket appears
    await nodes.expectVisible(ResourceNodeID.PublicImagesS3Bucket);
    await nodes.expectHidden(PolicyNodeID.S3ReadPolicy);

    // Continue tutorial
    await tutorial.expectPopoverAndClickNext(
      ResourceNodeID.PublicImagesS3Bucket,
      POPOVER_TUTORIAL_MESSAGES[3].popover_title
    );
    await nodes.expectVisible(PolicyNodeID.S3ReadPolicy);
    await tutorial.expectPopoverWithoutNextButton(
      PolicyNodeID.S3ReadPolicy,
      POPOVER_TUTORIAL_MESSAGES[5].popover_title
    );

    // Connect policy to user
    await nodes.connectNodes(PolicyNodeID.S3ReadPolicy, UserNodeID.TutorialUser);
    await edges.expectVisible(PolicyNodeID.S3ReadPolicy, UserNodeID.TutorialUser);
    await edges.expectVisible(UserNodeID.TutorialUser, ResourceNodeID.PublicImagesS3Bucket);

    // Access granted popover
    await tutorial.expectPopoverAndClickNext(
      UserNodeID.TutorialUser,
      POPOVER_TUTORIAL_MESSAGES[6].popover_title
    );

    await tutorial.expectPopoverWithoutNextButton(
      ElementID.NewEntityBtn,
      POPOVER_TUTORIAL_MESSAGES[7].popover_title
    );

    await popups.submitCreateEntityPopup(
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
    await edges.expectVisible(PolicyNodeID.S3ReadPolicy, UserNodeID.FirstUser);
    await edges.expectVisible(UserNodeID.FirstUser, ResourceNodeID.PublicImagesS3Bucket);

    // Final popovers
    await tutorial.expectPopoverAndClickNext(
      UserNodeID.FirstUser,
      POPOVER_TUTORIAL_MESSAGES[10].popover_title
    );
    await tutorial.expectPopoverAndClickNext(
      ElementID.ObjectivesSidePanel,
      POPOVER_TUTORIAL_MESSAGES[11].popover_title
    );

    await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  });
});
