import { ENCODED_LEVEL_STAGES } from './data';
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

test.describe('Stage 1 - Introduction to IAM Groups', () => {
  test('Initial Tutorial and Setup Flow', async ({ tutorial, nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial about IAM Groups', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
    });

    await test.step('Navigate through fixed popovers explaining current setup', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
    });

    await test.step('Verify initial setup with user, policies, and resources', async () => {
      await nodes.expectVisible(
        UserNodeID.FirstUser,
        PolicyNodeID.PolicyNode1,
        PolicyNodeID.PolicyNode2,
        PolicyNodeID.PolicyNode3,
        ResourceNodeID.S3Bucket,
        ResourceNodeID.EC2Instance,
        ResourceNodeID.DynamoDBTable
      );

      // Verify initial connections from policies to user
      await edges.expectVisible(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
      await edges.expectVisible(PolicyNodeID.PolicyNode2, UserNodeID.FirstUser);
      await edges.expectVisible(PolicyNodeID.PolicyNode3, UserNodeID.FirstUser);
    });

    await test.step('Introduction to creating IAM Group', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );

      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });
  });
});

test.describe('Stage 2 - Attach Users and Policies to Group', () => {
  test('Connect user first, then all policies', async ({ nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Verify group already exists from previous stage', async () => {
      await nodes.expectVisible(GroupNodeID.FirstGroup);
    });

    await test.step('Connect user to group first', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
    });

    await test.step('Connect all policies to group', async () => {
      await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
    });
  });

  test('Connect all policies first, then user', async ({ nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(2, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Verify group already exists from previous stage', async () => {
      await nodes.expectVisible(GroupNodeID.FirstGroup);
    });

    await test.step('Connect all policies to group first', async () => {
      await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
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
      // Connect an old-style direct connection that should no longer exist
      await nodes.connectNodes(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
    });

    await test.step('Complete all required connections', async () => {
      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
    });

    await test.step('Verify unnecessary edges warning appears', async () => {
      // The warning should appear because Policy1->User1 edge is unnecessary
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
      await tutorial.expectPopoverAndClickNext(
        GroupNodeID.FirstGroup,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );
    });

    await test.step('Create second user', async () => {
      await popups.submitCreateEntityPopup(
        'User2',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );
      await nodes.expectVisible(UserNodeID.SecondUser);
    });

    await test.step('Attach second user to group', async () => {
      await nodes.connectNodes(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
    });

    await test.step('Verify level completion popover appears', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.SecondUser,
        POPOVER_TUTORIAL_MESSAGES[6].popover_title
      );
    });

    await test.step('Verify level complete popup appears', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
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
      await tutorial.expectPopoverAndClickNext(
        GroupNodeID.FirstGroup,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );
    });

    await test.step('Create unnecessary edge before completing level', async () => {
      // Add a direct policy to user connection (old style, unnecessary)
      await nodes.connectNodes(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, UserNodeID.FirstUser);
    });

    await test.step('Create second user and attach to group', async () => {
      await popups.submitCreateEntityPopup(
        'User2',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );
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
    page,
    tutorial,
    nodes,
    edges,
    popups,
    goToLevel,
  }) => {
    await test.step('Navigate to Level 2', async () => {
      await goToLevel(2);
      await page.goto('http://localhost:5173');
    });

    await test.step('Complete initial IAM Groups introduction', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);

      await nodes.expectVisible(
        UserNodeID.FirstUser,
        PolicyNodeID.PolicyNode1,
        PolicyNodeID.PolicyNode2,
        PolicyNodeID.PolicyNode3,
        ResourceNodeID.S3Bucket,
        ResourceNodeID.EC2Instance,
        ResourceNodeID.DynamoDBTable
      );

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );

      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });

    await test.step('Create group and attach user first, then policies', async () => {
      await popups.submitCreateEntityPopup(
        'DevTeam',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );

      await nodes.expectVisible(GroupNodeID.FirstGroup);

      await nodes.connectNodes(UserNodeID.FirstUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.FirstUser, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode1, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode2, GroupNodeID.FirstGroup);

      await nodes.connectNodes(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);
      await edges.expectVisible(PolicyNodeID.PolicyNode3, GroupNodeID.FirstGroup);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.FirstUser,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );
    });

    await test.step('Create second user and attach to group', async () => {
      await tutorial.expectPopoverAndClickNext(
        GroupNodeID.FirstGroup,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );

      await popups.submitCreateEntityPopup(
        'JaneDevOps',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );

      await nodes.expectVisible(UserNodeID.SecondUser);

      await nodes.connectNodes(UserNodeID.SecondUser, GroupNodeID.FirstGroup);
      await edges.expectVisible(UserNodeID.SecondUser, GroupNodeID.FirstGroup);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.SecondUser,
        POPOVER_TUTORIAL_MESSAGES[6].popover_title
      );

      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
    });
  });
});
