import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { findUnnecessaryNode } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level9/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level9/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level9/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level9/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  UserNodeID,
  ResourceNodeID,
} from '@/levels/level9/types/node-id-enums';

const completeInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );
};

const verifyInitialLevelSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectVisible(
    GroupNodeID.BowserForce,
    GroupNodeID.PeachTeam,
    UserNodeID.Bowser,
    UserNodeID.Peach,
    UserNodeID.Mario,
    UserNodeID.Luigi,
    UserNodeID.Wario,
    UserNodeID.Waluigi
  );

  await edges.expectMutlipleVisible([
    [UserNodeID.Peach, GroupNodeID.PeachTeam],
    [UserNodeID.Mario, GroupNodeID.PeachTeam],
    [UserNodeID.Luigi, GroupNodeID.PeachTeam],
    [UserNodeID.Bowser, GroupNodeID.BowserForce],
    [UserNodeID.Wario, GroupNodeID.BowserForce],
    [UserNodeID.Waluigi, GroupNodeID.BowserForce],
  ]);
};

const createFirstPolicy = async (popups: PopupActions, nodes: NodeActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'TestPolicy1',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
  );
  await nodes.expectVisible(PolicyNodeID.RDSManagePolicy1);
};

const createSecondPolicy = async (popups: PopupActions, nodes: NodeActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'TestPolicy2',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
  );
  await nodes.expectVisible(PolicyNodeID.RDSManagePolicy2);
};

const verifyStage2FinalState = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectMultipleVisible([PolicyNodeID.RDSManagePolicy1, PolicyNodeID.RDSManagePolicy2]);

  await edges.expectMutlipleVisible([
    [PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam],
    [PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce],
    [UserNodeID.Mario, ResourceNodeID.RDS1],
    [UserNodeID.Luigi, ResourceNodeID.RDS1],
    [UserNodeID.Bowser, ResourceNodeID.RDS2],
    [UserNodeID.Wario, ResourceNodeID.RDS2],
    [UserNodeID.Waluigi, ResourceNodeID.RDS2],
  ]);
};

const completeStage3IntroPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[2].popover_title
  );
};

const createSharedPolicy = async (popups: PopupActions, nodes: NodeActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'FinalPolicy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3')
  );
  await nodes.expectVisible(PolicyNodeID.RDSSharedPolicy);
};

const createUnnecessaryPolicy = async (popups: PopupActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'UnnecessaryPolicy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
  );
};

const connectSharedPolicyToGroups = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(PolicyNodeID.RDSSharedPolicy, GroupNodeID.PeachTeam);
  await nodes.connectNodes(PolicyNodeID.RDSSharedPolicy, GroupNodeID.BowserForce);
};

const verifyStage3FinalState = async (edges: EdgeActions): Promise<void> => {
  await edges.expectMutlipleVisible([
    [PolicyNodeID.RDSSharedPolicy, GroupNodeID.PeachTeam],
    [PolicyNodeID.RDSSharedPolicy, GroupNodeID.BowserForce],
    [UserNodeID.Mario, ResourceNodeID.RDS1],
    [UserNodeID.Luigi, ResourceNodeID.RDS1],
    [UserNodeID.Bowser, ResourceNodeID.RDS2],
    [UserNodeID.Wario, ResourceNodeID.RDS2],
    [UserNodeID.Waluigi, ResourceNodeID.RDS2],
  ]);
};

const completeLevelFinishPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
  await tutorial.expectPopoverAndClickNext(
    PolicyNodeID.RDSSharedPolicy,
    POPOVER_TUTORIAL_MESSAGES[3].popover_title
  );
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
};

test.describe('Stage 1 - Initial Tutorial Flow', () => {
  test('Initial Tutorial Flow', async ({ tutorial, nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Go through initial popup and fixed popovers', async () => {
      await completeInitialTutorial(tutorial);
    });

    await test.step('Check initial nodes and edges', async () => {
      await verifyInitialLevelSetup(nodes, edges);
    });
  });
});

test.describe('Stage 2 - Create Initial Policies and Attach to Groups', () => {
  test('Order 1: Create all policies first, then connect to groups', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
    tutorial,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create all policies first', async () => {
      await createFirstPolicy(popups, nodes);
      await createSecondPolicy(popups, nodes);
    });

    await test.step('Connect policies to groups', async () => {
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.closePopover(UserNodeID.Peach, POPOVER_TUTORIAL_MESSAGES[1].popover_title);

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][1].id);
    });

    await test.step('Verify final state', async () => {
      await verifyStage2FinalState(nodes, edges);
    });
  });

  test('Order 2: Create and connect each policy immediately', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
    tutorial,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create and connect policies one at a time', async () => {
      await createFirstPolicy(popups, nodes);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.closePopover(UserNodeID.Peach, POPOVER_TUTORIAL_MESSAGES[1].popover_title);

      await createSecondPolicy(popups, nodes);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][1].id);
    });

    await test.step('Verify final state', async () => {
      await verifyStage2FinalState(nodes, edges);
    });
  });

  test('Order 3: Create policies in reverse order', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
    tutorial,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create policies in reverse order', async () => {
      await createSecondPolicy(popups, nodes);
      await createFirstPolicy(popups, nodes);
    });

    await test.step('Connect policies to groups', async () => {
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.closePopover(UserNodeID.Peach, POPOVER_TUTORIAL_MESSAGES[1].popover_title);

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][1].id);
    });

    await test.step('Verify final state', async () => {
      await verifyStage2FinalState(nodes, edges);
    });
  });

  test('Order 4: Connect policies to groups in reverse order', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
    tutorial,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create all policies first', async () => {
      await createFirstPolicy(popups, nodes);
      await createSecondPolicy(popups, nodes);
    });

    await test.step('Connect policies in reverse order', async () => {
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][1].id);

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.closePopover(UserNodeID.Peach, POPOVER_TUTORIAL_MESSAGES[1].popover_title);
    });

    await test.step('Verify final state', async () => {
      await verifyStage2FinalState(nodes, edges);
    });
  });

  test('Order 5: Mixed approach - complete Policy 1 workflow, then Policy 2', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
    tutorial,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete Policy 1 workflow first', async () => {
      await createFirstPolicy(popups, nodes);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.closePopover(UserNodeID.Peach, POPOVER_TUTORIAL_MESSAGES[1].popover_title);

      await nodes.expectVisible(PolicyNodeID.RDSManagePolicy1);
      await edges.expectVisible(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
    });

    await test.step('Complete Policy 2 workflow', async () => {
      await createSecondPolicy(popups, nodes);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][1].id);
    });

    await test.step('Verify final state', async () => {
      await verifyStage2FinalState(nodes, edges);
    });
  });
});

test.describe('Stage 3 - Create Shared Policy for Both Groups', () => {
  test('Create shared policy and attach to both groups', async ({
    goToLevelAtStage,
    tutorial,
    popups,
    nodes,
    edges,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete Stage 3 intro popups', async () => {
      await completeStage3IntroPopups(tutorial);
    });

    await test.step('Create shared policy', async () => {
      await createSharedPolicy(popups, nodes);
    });

    await test.step('Connect shared policy to both groups', async () => {
      await connectSharedPolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Verify final state', async () => {
      await verifyStage3FinalState(edges);
    });

    await test.step('Complete level finish popups', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Verify unnecessary nodes warning appears', async ({
    goToLevelAtStage,
    page,
    tutorial,
    popups,
    nodes,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Complete Stage 3 with unnecessary user node', async () => {
      await completeStage3IntroPopups(tutorial);
      await createUnnecessaryPolicy(popups);
      await createSharedPolicy(popups, nodes);
      await connectSharedPolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][0].id);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
      await tutorial.expectPopoverAndClickNext(
        PolicyNodeID.RDSSharedPolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Verify unnecessary nodes warning appears', async () => {
      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
    });

    await test.step('Remove unnecessary node to complete level', async () => {
      const unnecessaryNode = findUnnecessaryNode(page);
      const unnecessaryNodeId = await unnecessaryNode.getAttribute('data-element-id');

      await nodes.deleteNode(unnecessaryNodeId!);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
    });

    await test.step('Expect level finished popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
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
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial', async () => {
      await completeInitialTutorial(tutorial);
      await verifyInitialLevelSetup(nodes, edges);
    });

    await test.step('Complete Stage 2 - Create and attach initial policies', async () => {
      await createFirstPolicy(popups, nodes);
      await createSecondPolicy(popups, nodes);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][0].id);
      await tutorial.closePopover(UserNodeID.Peach, POPOVER_TUTORIAL_MESSAGES[1].popover_title);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[0][1].id);
      await verifyStage2FinalState(nodes, edges);
    });

    await test.step('Complete Stage 3 - Create shared policy', async () => {
      await completeStage3IntroPopups(tutorial);
      await createSharedPolicy(popups, nodes);
      await connectSharedPolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][0].id);
      await verifyStage3FinalState(edges);
      await completeLevelFinishPopups(tutorial);
    });
  });
});
