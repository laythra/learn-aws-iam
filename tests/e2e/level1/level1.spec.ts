import { EdgeActions } from '../helpers/edge-actions';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ENCODED_LEVEL_STAGES } from '../level1/data';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/machines/level1/objectives/level-objectives';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level1/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level1/tutorial_messages/popup-tutorial-messages';
import { UserNodeID, ResourceNodeID, PolicyNodeID } from '@/machines/level1/types/node-id-enums';

test.describe('Level 1 Entire Flow', () => {
  const goThroughInitialTutorial = async (
    tutorial: TutorialActions,
    nodes: NodeActions
  ): Promise<void> => {
    await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);

    await nodes.expectVisible(UserNodeID.TutorialUser);
    await nodes.expectHidden(ResourceNodeID.PublicImagesS3Bucket);
    await nodes.expectHidden(PolicyNodeID.S3ReadPolicy);

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

    await nodes.expectVisible(ResourceNodeID.PublicImagesS3Bucket);
    await nodes.expectHidden(PolicyNodeID.S3ReadPolicy);

    await tutorial.expectPopoverAndClickNext(
      ResourceNodeID.PublicImagesS3Bucket,
      POPOVER_TUTORIAL_MESSAGES[3].popover_title
    );
    await nodes.expectVisible(PolicyNodeID.S3ReadPolicy);
    await tutorial.expectPopoverAndClickNext(
      PolicyNodeID.S3ReadPolicy,
      POPOVER_TUTORIAL_MESSAGES[4].popover_title
    );
    await tutorial.expectPopoverWithoutNextButton(
      PolicyNodeID.S3ReadPolicy,
      POPOVER_TUTORIAL_MESSAGES[5].popover_title
    );

    await tutorial.closePopover(
      PolicyNodeID.S3ReadPolicy,
      POPOVER_TUTORIAL_MESSAGES[5].popover_title
    );
  };

  const connectPolicyToTutorialUser = async (
    nodes: NodeActions,
    edges: EdgeActions,
    tutorial: TutorialActions
  ): Promise<void> => {
    await nodes.connectNodes(PolicyNodeID.S3ReadPolicy, UserNodeID.TutorialUser);
    await edges.expectVisible(PolicyNodeID.S3ReadPolicy, UserNodeID.TutorialUser);
    await edges.expectVisible(UserNodeID.TutorialUser, ResourceNodeID.PublicImagesS3Bucket);

    await tutorial.expectPopoverAndClickNext(
      UserNodeID.TutorialUser,
      POPOVER_TUTORIAL_MESSAGES[6].popover_title
    );
  };

  const createCustomUserNode = async (
    tutorial: TutorialActions,
    popups: PopupActions
  ): Promise<void> => {
    await popups.submitCreateEntityPopup(
      'CustomUser',
      ElementID.CreateEntitiesMenuItem,
      ElementID.IAMIdentityCreatorPopup
    );

    await tutorial.expectPopoverWithoutNextButton(
      UserNodeID.FirstUser,
      POPOVER_TUTORIAL_MESSAGES[7].popover_title
    );
  };

  const connectPolicyToCustomUser = async (
    nodes: NodeActions,
    edges: EdgeActions
  ): Promise<void> => {
    await nodes.connectNodes(PolicyNodeID.S3ReadPolicy, UserNodeID.FirstUser);
    await edges.expectVisible(PolicyNodeID.S3ReadPolicy, UserNodeID.FirstUser);
    await edges.expectVisible(UserNodeID.FirstUser, ResourceNodeID.PublicImagesS3Bucket);
  };

  test('Go Through Entire Flow', async ({
    tutorial,
    edges,
    nodes,
    popups,
    goToLevelAtStage,
    page,
  }) => {
    await goToLevelAtStage(1, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Go Through Initial Tutorial', async () => {
      await goThroughInitialTutorial(tutorial, nodes);
    });

    await test.step('Connect Policy to Tutorial User', async () => {
      await connectPolicyToTutorialUser(nodes, edges, tutorial);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0].id);
    });

    await test.step('Create Custom User Node', async () => {
      await createCustomUserNode(tutorial, popups);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1].label);
    });

    await test.step('Connect Policy to Custom User', async () => {
      await connectPolicyToCustomUser(nodes, edges);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[2].label);
    });
  });

  // test('Go Through Entire Flow while creating unnecessary nodes/edges', async ({
  //   page,
  //   tutorial,
  //   edges,
  //   nodes,
  //   popups,
  //   goToLevel,
  // }) => {
  //   test.step('Go Through Initial Tutorial', async () => {
  //     await goThroughInitialTutorial(tutorial, nodes);
  //   });

  //   test.step('Connect Policy to Tutorial User', async () => {
  //     await connectPolicyToTutorialUser(nodes, edges, tutorial);
  //   });

  //   test.step('Create Custom User Node with an Unnecessary Node', async () => {
  //     await createCustomUserNode(tutorial, popups);
  //     // Create an unnecessary node
  //     await popups.submitCreateEntityPopup(
  //       'CustomUser',
  //       ElementID.CreateEntitiesMenuItem,
  //       ElementID.IAMIdentityCreatorPopup
  //     );
  //   });

  //   test.step('Connect Policy to Custom User', async () => {
  //     await connectPolicyToCustomUser(nodes, edges);
  //   });

  //   test.step('Handle Unnecessary Nodes/Edges warning', async () => {
  //     await tutorial.expectUnnecessaryEdgesNodesWarning(true);
  //     const unnecessaryNode = findUnnecessaryNode(page);
  //     await unnecessaryNode.click();
  //     await page.keyboard.press('Backspace');

  //     await tutorial.expectUnnecessaryEdgesNodesWarning(false);
  //   });
  // });
});
