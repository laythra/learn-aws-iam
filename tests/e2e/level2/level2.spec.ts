import { ENCODED_LEVEL_STAGES } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
// prettier-ignore
import { LEVEL_OBJECTIVES } from '@/levels/level2/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level2/tutorial_messages/fixed-popover-messages';
// prettier-ignore
import {
  POPOVER_TUTORIAL_MESSAGES
} from '@/levels/level2/tutorial_messages/popover-tutorial-messages';
// prettier-ignore
import {
  POPUP_TUTORIAL_MESSAGES
} from '@/levels/level2/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  ResourceNodeID,
  UserNodeID,
} from '@/levels/level2/types/node-id-enums';
import { IAMNodeEntity } from '@/types/iam-enums';

const createCustomGroupNode = async (popups: PopupActions, name: string): Promise<void> => {
  await popups.createUserGroupNode(
    name,
    ElementID.CreateUserGroupMenuItem,
    ElementID.IAMIdentityCreatorPopup,
    IAMNodeEntity.Group
  );
};

const createCustomUserNode = async (popups: PopupActions, name: string): Promise<void> => {
  await popups.createUserGroupNode(
    name,
    ElementID.CreateUserGroupMenuItem,
    ElementID.IAMIdentityCreatorPopup,
    IAMNodeEntity.User
  );
};

const verifyLevelInitialSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectVisible(
    UserNodeID.FirstUser,
    PolicyNodeID.PolicyNode1,
    PolicyNodeID.PolicyNode2,
    PolicyNodeID.PolicyNode3,
    ResourceNodeID.S3Bucket,
    ResourceNodeID.EC2Instance,
    ResourceNodeID.DynamoDBTable
  );

  await edges.expectVisible(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
  await edges.expectVisible(PolicyNodeID.PolicyNode2, UserNodeID.FirstUser);
  await edges.expectVisible(PolicyNodeID.PolicyNode3, UserNodeID.FirstUser);
};

const goThroughInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
};

const completeStage1IntroTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopoverAndClickNext(
    UserNodeID.FirstUser,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );

  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );
};

const verifyStage2InitialSetup = async (nodes: NodeActions): Promise<void> => {
  await nodes.expectVisible(GroupNodeID.FirstGroup);
  await nodes.expectMultipleVisible([
    UserNodeID.FirstUser,
    PolicyNodeID.PolicyNode1,
    PolicyNodeID.PolicyNode2,
    PolicyNodeID.PolicyNode3,
  ]);
};

const connectAllPoliciesToGroup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
  await edges.expectVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);

  await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
  await edges.expectVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);

  await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
  await edges.expectVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
};

const completeStage3IntroTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopoverAndClickNext(
    GroupNodeID.FirstGroup,
    POPOVER_TUTORIAL_MESSAGES[5].popover_title
  );
};

const completeLevelFinishPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopoverAndClickNext(
    UserNodeID.SecondUser,
    POPOVER_TUTORIAL_MESSAGES[6].popover_title
  );

  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
};

test.describe('Stage 1 - Introduction to IAM Groups', () => {
  test('Initial Tutorial and Setup Flow', async ({
    tutorial,
    nodes,
    edges,
    goToLevelAtStage,
    popups,
  }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial about IAM Groups', async () => {
      await goThroughInitialTutorial(tutorial);
    });

    await test.step('Verify initial setup with user, policies, and resources', async () => {
      await verifyLevelInitialSetup(nodes, edges);
    });

    await test.step('Introduction to creating IAM Group', async () => {
      await completeStage1IntroTutorial(tutorial);
    });

    await test.step('Create first IAM Group', async () => {
      await createCustomGroupNode(popups, 'DevTeam');
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
    });
  });
});

test.describe('Stage 2 - Attach Users and Policies to Group', () => {
  test('Connect user first, then all policies', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
  }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Verify group already exists from previous stage', async () => {
      await verifyStage2InitialSetup(nodes);
    });

    await test.step('Connect user to group first', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
    });

    await test.step('Connect all policies to group', async () => {
      await connectAllPoliciesToGroup(nodes, edges);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });
  });

  test('Connect all policies first, then user', async ({ nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Verify group already exists from previous stage', async () => {
      await nodes.expectVisible(GroupNodeID.FirstGroup);
    });

    await test.step('Connect all policies to group first', async () => {
      await connectAllPoliciesToGroup(nodes, edges);
    });

    await test.step('Connect user to group', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
    });
  });

  test('Interleaved connections', async ({ nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Verify group already exists from previous stage', async () => {
      await nodes.expectVisible(GroupNodeID.FirstGroup);
    });

    await test.step('Connect nodes in interleaved order', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
    });
  });

  test('Connect in reverse order - policies 3, 2, 1, then user', async ({
    nodes,
    edges,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Verify group already exists from previous stage', async () => {
      await nodes.expectVisible(GroupNodeID.FirstGroup);
    });

    await test.step('Connect policies in reverse order', async () => {
      await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
    });

    await test.step('Connect user last', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
    });
  });

  test('Handle unnecessary edges warning - leave old policy connections', async ({
    tutorial,
    nodes,
    edges,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Verify group already exists', async () => {
      await nodes.expectVisible(GroupNodeID.FirstGroup);
    });

    await test.step('Add unnecessary edge first (policy to user directly)', async () => {
      await nodes.connectNodes(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
    });

    await test.step('Complete all required connections', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);

      await connectAllPoliciesToGroup(nodes, edges);
    });

    await test.step('Verify unnecessary edges warning appears', async () => {
      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
    });
  });
});

test.describe('Stage 3 - Create Second User and Attach to Group', () => {
  test('Create and attach second user', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Verify we are at stage 3 with group and first user attached', async () => {
      await nodes.expectVisible(GroupNodeID.FirstGroup);
      await nodes.expectVisible(UserNodeID.FirstUser);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
    });

    await test.step('Skip the tutorial popover', async () => {
      await completeStage3IntroTutorial(tutorial);
    });

    await test.step('Create second user', async () => {
      await createCustomUserNode(popups, 'User2');
      await nodes.expectVisible(UserNodeID.SecondUser);
    });

    await test.step('Attach second user to group', async () => {
      await nodes.connectNodes(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
    });

    await test.step('Verify level completion', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Handle unnecessary edges warning at level completion', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Skip the tutorial popover', async () => {
      await completeStage3IntroTutorial(tutorial);
    });

    await test.step('Create unnecessary edge before completing level', async () => {
      await nodes.connectNodes(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
    });

    await test.step('Create second user and attach to group', async () => {
      await createCustomUserNode(popups, 'JaneDevOps');
      await nodes.expectVisible(UserNodeID.SecondUser);

      await nodes.connectNodes(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
    });

    await test.step('Click next on completion popover to trigger warning check', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.SecondUser,
        POPOVER_TUTORIAL_MESSAGES[6].popover_title
      );
    });

    await test.step('Verify unnecessary edges warning appears', async () => {
      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete full level flow - user first approach', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial and group creation', async () => {
      await goThroughInitialTutorial(tutorial);
      await verifyLevelInitialSetup(nodes, edges);
      await completeStage1IntroTutorial(tutorial);

      await createCustomGroupNode(popups, 'DevTeam');
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
      await nodes.expectVisible(GroupNodeID.FirstGroup);
    });

    await test.step('Complete Stage 2 - Attach user and policies to group', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);

      await connectAllPoliciesToGroup(nodes, edges);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );

      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });

    await test.step('Complete Stage 3 - Create second user and finish level', async () => {
      await completeStage3IntroTutorial(tutorial);

      await createCustomUserNode(popups, 'JaneDevOps');
      await nodes.expectVisible(UserNodeID.SecondUser);

      await nodes.connectNodes(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);

      await completeLevelFinishPopups(tutorial);
    });
  });
});
