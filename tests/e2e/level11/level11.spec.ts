import { ENCODED_TEST_SOLUTIONS, ENCODED_LEVEL_STAGES } from './data';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { ElementID } from '@/config/element-ids';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level11/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level11/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level11/tutorial_messages/popup-tutorial-messages';
import {
  UserNodeID,
  PolicyNodeID,
  RoleNodeID,
  PermissionBoundaryID,
  ResourceNodeID,
} from '@/machines/level11/types/node-id-enums';

test.describe('Stage 1 - Permission Boundaries Introduction', () => {
  test('Initial Tutorial and Setup Flow', async ({ tutorial, nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(11, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial about Permission Boundaries', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
    });

    await test.step('Verify initial tutorial setup with permission boundaries', async () => {
      await nodes.expectVisible(
        UserNodeID.Sephiroth,
        PermissionBoundaryID.PermissionBoundary1,
        PolicyNodeID.Policy1,
        ResourceNodeID.S3BucketTutorial
      );

      await edges.expectVisible(PermissionBoundaryID.PermissionBoundary1, UserNodeID.Sephiroth);
    });

    await test.step('View permission boundary content', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PermissionBoundaryID.PermissionBoundary1,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );
      await nodes.openNodePopover(PermissionBoundaryID.PermissionBoundary1, 'content');
      await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[0].popover_title);
      await nodes.closeNodePopover(PermissionBoundaryID.PermissionBoundary1, 'content');
    });

    await test.step('Demonstrate permission boundary in action', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.Policy1,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );

      // Connect S3 policy to Sephiroth
      await nodes.connectNodes(PolicyNodeID.Policy1, UserNodeID.Sephiroth);
      await edges.expectVisible(PolicyNodeID.Policy1, UserNodeID.Sephiroth);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Sephiroth,
        POPOVER_TUTORIAL_MESSAGES[2].popover_title
      );
    });
  });
});

test.describe('Stage 2 - Create Permission Boundary and Delegation Policy', () => {
  test('Create Permission Boundary', async ({ tutorial, nodes, popups, goToLevelAtStage }) => {
    await goToLevelAtStage(11, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete main level introduction', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
    });

    await test.step('Navigate through permission boundary creation tutorial', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Cloud,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Cloud,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );
      await tutorial.expectPopoverAndClickNext(
        RoleNodeID.Role1,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );
      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[6].popover_title
      );
    });

    await test.step('Create secrets reading permission boundary', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPermissionBoundaryTab],
        ElementID.CodeEditorPermissionBoundaryTab,
        'pb',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );

      await nodes.expectVisible(PermissionBoundaryID.SecretsReadingPermissionBoundary);
      await tutorial.expectPopoverAndClickNext(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        POPOVER_TUTORIAL_MESSAGES[7].popover_title
      );
    });

    await test.step('Create delegation policy', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[8].popover_title
      );

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        PolicyNodeID.AccessDelegationPolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );

      await nodes.expectVisible(PolicyNodeID.AccessDelegationPolicy);
    });
  });
});

test.describe('Stage 3 - Connect Nodes and Complete Level', () => {
  test('Connect permission boundary and delegation policy to role', async ({
    tutorial,
    nodes,
    edges,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(11, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Connect permission boundary to role', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Cloud,
        POPOVER_TUTORIAL_MESSAGES[9].popover_title
      );

      // Manual connection required by user
      await nodes.connectNodes(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        RoleNodeID.Role1
      );
      await edges.expectVisible(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        RoleNodeID.Role1
      );
    });

    await test.step('Connect delegation policy to Cloud user', async () => {
      await nodes.connectNodes(PolicyNodeID.AccessDelegationPolicy, UserNodeID.Cloud);
      await edges.expectVisible(PolicyNodeID.AccessDelegationPolicy, UserNodeID.Cloud);
    });

    await test.step('Proceed through final tutorial stages with auto-connections', async () => {
      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.FullAccessPolicy,
        POPOVER_TUTORIAL_MESSAGES[10].popover_title
      );

      await edges.expectVisible(PolicyNodeID.FullAccessPolicy, RoleNodeID.Role1);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Tifa,
        POPOVER_TUTORIAL_MESSAGES[11].popover_title
      );

      await edges.expectVisible(UserNodeID.Tifa, RoleNodeID.Role1);

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
    });

    await test.step('Complete level', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });
  });

  test('Connect nodes in reverse order', async ({ tutorial, nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(11, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Connect delegation policy to Cloud user first', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Cloud,
        POPOVER_TUTORIAL_MESSAGES[9].popover_title
      );

      await nodes.connectNodes(PolicyNodeID.AccessDelegationPolicy, UserNodeID.Cloud);
      await edges.expectVisible(PolicyNodeID.AccessDelegationPolicy, UserNodeID.Cloud);
    });

    await test.step('Connect permission boundary to role second', async () => {
      await nodes.connectNodes(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        RoleNodeID.Role1
      );
      await edges.expectVisible(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        RoleNodeID.Role1
      );
    });

    await test.step('Complete remaining tutorial steps with auto-connections', async () => {
      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.FullAccessPolicy,
        POPOVER_TUTORIAL_MESSAGES[10].popover_title
      );

      await edges.expectVisible(PolicyNodeID.FullAccessPolicy, RoleNodeID.Role1);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Tifa,
        POPOVER_TUTORIAL_MESSAGES[11].popover_title
      );

      await edges.expectVisible(UserNodeID.Tifa, RoleNodeID.Role1);

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
    });

    await test.step('Complete level', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });
  });
});

test.describe('Complete Level Workflow - End to End', () => {
  test('Complete level from start to finish', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(11, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Stage 1: Complete initial permission boundary tutorial', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);

      await nodes.expectVisible(
        UserNodeID.Sephiroth,
        PermissionBoundaryID.PermissionBoundary1,
        PolicyNodeID.Policy1,
        ResourceNodeID.S3BucketTutorial
      );

      await tutorial.expectPopoverWithoutNextButton(
        PermissionBoundaryID.PermissionBoundary1,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );
      await nodes.openNodePopover(PermissionBoundaryID.PermissionBoundary1, 'content');
      await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[0].popover_title);
      await nodes.closeNodePopover(PermissionBoundaryID.PermissionBoundary1, 'content');

      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.Policy1,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
      await nodes.connectNodes(PolicyNodeID.Policy1, UserNodeID.Sephiroth);
      await edges.expectVisible(PolicyNodeID.Policy1, UserNodeID.Sephiroth);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Sephiroth,
        POPOVER_TUTORIAL_MESSAGES[2].popover_title
      );
    });

    await test.step('Stage 2: Create permission boundary and delegation policy', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Cloud,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Cloud,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );
      await tutorial.expectPopoverAndClickNext(
        RoleNodeID.Role1,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );
      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[6].popover_title
      );

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPermissionBoundaryTab],
        ElementID.CodeEditorPermissionBoundaryTab,
        'pb',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );

      await nodes.expectVisible(PermissionBoundaryID.SecretsReadingPermissionBoundary);
      await tutorial.expectPopoverAndClickNext(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        POPOVER_TUTORIAL_MESSAGES[7].popover_title
      );

      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[8].popover_title
      );

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        PolicyNodeID.AccessDelegationPolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );

      await nodes.expectVisible(PolicyNodeID.AccessDelegationPolicy);
    });

    await test.step('Stage 3: Connect nodes and complete level', async () => {
      await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[1].popover_title);

      await nodes.connectNodes(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        RoleNodeID.Role1
      );
      await edges.expectVisible(
        PermissionBoundaryID.SecretsReadingPermissionBoundary,
        RoleNodeID.Role1
      );

      await nodes.connectNodes(PolicyNodeID.AccessDelegationPolicy, UserNodeID.Cloud);
      await edges.expectVisible(PolicyNodeID.AccessDelegationPolicy, UserNodeID.Cloud);

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Cloud,
        POPOVER_TUTORIAL_MESSAGES[9].popover_title
      );

      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.FullAccessPolicy,
        POPOVER_TUTORIAL_MESSAGES[10].popover_title
      );
      await edges.expectVisible(PolicyNodeID.FullAccessPolicy, RoleNodeID.Role1);

      await tutorial.expectPopoverAndClickNext(
        UserNodeID.Tifa,
        POPOVER_TUTORIAL_MESSAGES[11].popover_title
      );
      await edges.expectVisible(UserNodeID.Tifa, RoleNodeID.Role1);

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
    });
  });
});
