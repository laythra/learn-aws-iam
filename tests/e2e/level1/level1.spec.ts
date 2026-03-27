import { EdgeActions } from '../helpers/edge-actions';
import { EntityCreationActions } from '../helpers/entity-creation-actions';
import { findUnnecessaryNode } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { test } from '../helpers/test-fixtures';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ENCODED_LEVEL_STAGES } from '../level1/data';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level1/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level1/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level1/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level1/tutorial_messages/popup-tutorial-messages';
import { UserNodeID, ResourceNodeID, PolicyNodeID } from '@/levels/level1/types/node-ids';
import { IAMNodeEntity } from '@/types/iam-enums';

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

    await tutorial.expectFixedPopoverWithTutorialGif(FIXED_POPOVER_MESSAGES[0].popover_title);
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
      POPOVER_TUTORIAL_MESSAGES[5].popover_title
    );
  };

  const createCustomUserNode = async (
    entities: EntityCreationActions,
    name: string
  ): Promise<void> => {
    await entities.createUserGroupNode(
      name,
      ElementID.CreateUserGroupMenuItem,
      ElementID.IAMIdentityCreatorPopup,
      IAMNodeEntity.User
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
    entities,
    progress,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(1, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Go Through Initial Tutorial', async () => {
      await goThroughInitialTutorial(tutorial, nodes);
    });

    await test.step('Connect Policy to Tutorial User', async () => {
      await connectPolicyToTutorialUser(nodes, edges, tutorial);
      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0].id);
    });

    await test.step('Create Custom User Node', async () => {
      await createCustomUserNode(entities, 'FirstUser');
      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1].id);
      await tutorial.expectPopoverWithoutNextButton(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[8].popover_title
      );
    });

    await test.step('Connect Policy to Custom User', async () => {
      await connectPolicyToCustomUser(nodes, edges);
      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[2].id);
    });

    await test.step('Complete Level', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[9].popover_title
      );

      await tutorial.expectPopoverAndClickNext(
        ElementID.ObjectivesSidePanel,
        POPOVER_TUTORIAL_MESSAGES[10].popover_title
      );

      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
    });
  });

  test('Go Through Entire Flow while creating unnecessary nodes/edges', async ({
    page,
    tutorial,
    edges,
    nodes,
    entities,
    progress,
    ui,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(1, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Go Through Initial Tutorial', async () => {
      await goThroughInitialTutorial(tutorial, nodes);
    });

    await test.step('Connect Policy to Tutorial User', async () => {
      await connectPolicyToTutorialUser(nodes, edges, tutorial);
      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0].id);
    });

    await test.step('Create Custom User Node with an Unnecessary Node', async () => {
      await createCustomUserNode(entities, 'FirstUser');
      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1].id);
      await tutorial.expectPopoverWithoutNextButton(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[8].popover_title
      );

      await createCustomUserNode(entities, 'UnnecessaryUser');
    });

    await test.step('Connect Policy to Custom User', async () => {
      await connectPolicyToCustomUser(nodes, edges);
      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[2].id);
    });

    await test.step('Complete Level', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[9].popover_title
      );

      await tutorial.expectPopoverAndClickNext(
        ElementID.ObjectivesSidePanel,
        POPOVER_TUTORIAL_MESSAGES[10].popover_title
      );
    });

    await test.step('Expect and handle Unnecessary Nodes/Edges warning', async () => {
      await ui.expectUnnecessaryEdgesNodesWarning(true);
      const unnecessaryNode = findUnnecessaryNode(page);
      await unnecessaryNode.click();
      await page.keyboard.press('Backspace');

      await ui.expectUnnecessaryEdgesNodesWarning(false);
    });

    await test.step('Go Through Last Popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
    });
  });
});
