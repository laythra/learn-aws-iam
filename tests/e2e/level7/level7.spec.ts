import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level7/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level7/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level7/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level7/tutorial_messages/popup-tutorial-messages';
import {
  UserNodeID,
  ResourceNodeID,
  ResourcePolicyNodeID,
  PolicyNodeID,
  AccountID,
} from '@/levels/level7/types/node-ids';

const completeTutorialPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );
};

const verifyLevelInitialSetup = async (nodes: NodeActions): Promise<void> => {
  await nodes.expectMultipleVisible([
    UserNodeID.TutorialFirstUser,
    ResourceNodeID.TutorialS3Bucket,
  ]);
};

const completeStage2IntroPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectPopoverAndClickNext(
    ResourceNodeID.InsideLevelS3Bucket,
    POPOVER_TUTORIAL_MESSAGES[2].popover_title
  );
  await tutorial.expectPopoverAndClickNext(
    UserNodeID.InsideLevelUser,
    POPOVER_TUTORIAL_MESSAGES[3].popover_title
  );
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[4].popover_title
  );
};

const verifyStage2InitialSetup = async (nodes: NodeActions): Promise<void> => {
  await nodes.expectMultipleVisible([
    UserNodeID.InsideLevelUser,
    ResourceNodeID.InsideLevelS3Bucket,
  ]);
};

const completeStage3IntroPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[7].popover_title
  );
};

const verifyStage3InitialSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectMultipleVisible([
    UserNodeID.InsideLevelUser,
    ResourceNodeID.InsideLevelS3Bucket,
    PolicyNodeID.InsideLevelIdentityBasedPolicy,
  ]);

  await edges.expectMutlipleVisible([
    [PolicyNodeID.InsideLevelIdentityBasedPolicy, UserNodeID.InsideLevelUser],
  ]);
};

const completeLevelFinishPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopoverAndClickNext(
    UserNodeID.InsideLevelUser,
    POPOVER_TUTORIAL_MESSAGES[8].popover_title
  );
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
};

const createFirstResourcePolicy = async (
  popups: PopupActions,
  nodes: NodeActions
): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorResourcePolicyTab],
    ElementID.CodeEditorResourcePolicyTab,
    'umbrella-files-access-policy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'resource_policy1')
  );

  await nodes.expectVisible(ResourcePolicyNodeID.TutorialResourceBasedPolicy);
};

const createIdentityBasedPolicy = async (
  popups: PopupActions,
  nodes: NodeActions
): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'rpd-case-files-access-policy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'identity_policy1'),
    AccountID.TrustedAccount
  );

  await nodes.expectVisible(PolicyNodeID.InsideLevelIdentityBasedPolicy);
};

const createSecondResourcePolicy = async (
  popups: PopupActions,
  nodes: NodeActions
): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorResourcePolicyTab],
    ElementID.CodeEditorResourcePolicyTab,
    'rpd-case-files-resource-policy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'resource_policy2')
  );

  await nodes.expectVisible(ResourcePolicyNodeID.InsideLevelResourceBasedPolicy);
};

test.describe('Stage 1 - Resource Policies Introduction', () => {
  test('Initial Tutorial Flow and First Resource Policy', async ({
    tutorial,
    goToLevelAtStage,
    nodes,
    popups,
  }) => {
    await goToLevelAtStage(7, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Verify initial level setup', async () => {
      await verifyLevelInitialSetup(nodes);
    });

    await test.step('Create first resource policy', async () => {
      await createFirstResourcePolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.TutorialFirstUser,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });
  });
});

test.describe('Stage 2 - Identity Based Policy Creation', () => {
  test('Create and attach identity based policy', async ({
    tutorial,
    goToLevelAtStage,
    nodes,
    popups,
  }) => {
    await goToLevelAtStage(7, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete Stage 2 intro popups', async () => {
      await completeStage2IntroPopups(tutorial);
    });

    await test.step('Verify Stage 2 initial setup', async () => {
      await verifyStage2InitialSetup(nodes);
    });

    await test.step('Create identity based policy', async () => {
      await createIdentityBasedPolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.InsideLevelIdentityBasedPolicy,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );
    });

    await test.step('Attach policy to user', async () => {
      await nodes.connectNodes(
        PolicyNodeID.InsideLevelIdentityBasedPolicy,
        UserNodeID.InsideLevelUser
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.InsideLevelUser,
        POPOVER_TUTORIAL_MESSAGES[6].popover_title
      );
    });
  });
});

test.describe('Stage 3 - Creating Cross Account Access through Resource Based Policy', () => {
  test('Create second resource policy and complete level', async ({
    tutorial,
    goToLevelAtStage,
    nodes,
    edges,
    popups,
  }) => {
    await goToLevelAtStage(7, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete Stage 3 intro popups', async () => {
      await completeStage3IntroPopups(tutorial);
    });

    await test.step('Verify Stage 3 initial setup', async () => {
      await verifyStage3InitialSetup(nodes, edges);
    });

    await test.step('Create second resource policy', async () => {
      await createSecondResourcePolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[2][0].id);
    });

    await test.step('Complete level finish popups', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(7, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial and first resource policy', async () => {
      await completeTutorialPopups(tutorial);
      await verifyLevelInitialSetup(nodes);
      await createFirstResourcePolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.TutorialFirstUser,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });

    await test.step('Complete Stage 2 - Identity based policy creation & attachment', async () => {
      await completeStage2IntroPopups(tutorial);
      await verifyStage2InitialSetup(nodes);
      await createIdentityBasedPolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.InsideLevelIdentityBasedPolicy,
        POPOVER_TUTORIAL_MESSAGES[5].popover_title
      );
      await nodes.connectNodes(
        PolicyNodeID.InsideLevelIdentityBasedPolicy,
        UserNodeID.InsideLevelUser
      );
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.InsideLevelUser,
        POPOVER_TUTORIAL_MESSAGES[6].popover_title
      );
    });

    await test.step('Complete Stage 3 - Cross account access with resource policy', async () => {
      await completeStage3IntroPopups(tutorial);
      await verifyStage3InitialSetup(nodes, edges);
      await createSecondResourcePolicy(popups, nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[2][0].id);
      await completeLevelFinishPopups(tutorial);
    });
  });
});
