import { test } from '../helpers/test-fixtures';
import { ElementID } from '@/config/element-ids';
// prettier-ignore
import {
  FIXED_POPOVER_MESSAGES
} from '@/machines/level2/tutorial_messages/fixed-popover-messages';
// prettier-ignore
import {
  POPOVER_TUTORIAL_MESSAGES
} from '@/machines/level2/tutorial_messages/popover-tutorial-messages';
// prettier-ignore
import {
  POPUP_TUTORIAL_MESSAGES
} from '@/machines/level2/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  ResourceNodeID,
  UserNodeID,
} from '@/machines/level2/types/node-id-enums';

test.describe('Level 2', () => {
  test('Goes through the entirety of level 2', async ({
    page,
    tutorial,
    nodes,
    popups,
    goToLevel,
  }) => {
    await test.step('Open Level 2', async () => {
      await goToLevel(2);
      await page.goto('http://localhost:5173');
    });

    await test.step('Initial Popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
    });

    await test.step('Initial fixed popovers', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
    });

    await test.step('Check initial nodes visibility', async () => {
      await nodes.expectMultipleVisible([
        UserNodeID.FirstUser,
        ResourceNodeID.DynamoDBTable,
        ResourceNodeID.EC2Instance,
        ResourceNodeID.S3Bucket,
        PolicyNodeID.PolicyNode1,
        PolicyNodeID.PolicyNode2,
        PolicyNodeID.PolicyNode3,
      ]);
    });

    await test.step('Go through initial popovers', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );

      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });

    await test.step('Open identity creator popup and create a group', async () => {
      await popups.submitCreateEntityPopup(
        'TestGroup',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );

      await nodes.expectVisible(GroupNodeID.FirstGroup);
      await tutorial.expectPopoverWithoutNextButton(
        GroupNodeID.FirstGroup,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Attach nodes to the group', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);

      await nodes.expectEdgeVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await nodes.expectEdgeVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await nodes.expectEdgeVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await nodes.expectEdgeVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );
    });

    await test.step('Create new user', async () => {
      await tutorial.expectPopoverAndClickNext(
        GroupNodeID.FirstGroup,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );

      await popups.submitCreateEntityPopup(
        'TextUser',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );
    });

    await test.step('Attach new user to group', async () => {
      await nodes.expectVisible(UserNodeID.SecondUser);
      await nodes.connectNodes(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
      await nodes.expectEdgeVisible(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
    });

    await test.step('Finish level 2', async () => {
      await tutorial.expectFixedPopoverAndClickNext(POPOVER_TUTORIAL_MESSAGES[6].popover_title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
    });
  });
});
