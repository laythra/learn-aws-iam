import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { findUnnecessaryNode } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level9/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level9/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level9/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  UserNodeID,
  ResourceNodeID,
} from '@/machines/level9/types/node-id-enums';

test.describe('Stage 1 - Initial Tutorial Flow', () => {
  const assertNodesAreVisible = async (nodes: NodeActions): Promise<void> => {
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
  };

  const assertEdgesAreVisible = async (edges: EdgeActions): Promise<void> => {
    await edges.expectVisible(UserNodeID.Peach, GroupNodeID.PeachTeam);
    await edges.expectVisible(UserNodeID.Mario, GroupNodeID.PeachTeam);
    await edges.expectVisible(UserNodeID.Luigi, GroupNodeID.PeachTeam);
    await edges.expectVisible(UserNodeID.Bowser, GroupNodeID.BowserForce);
    await edges.expectVisible(UserNodeID.Wario, GroupNodeID.BowserForce);
    await edges.expectVisible(UserNodeID.Waluigi, GroupNodeID.BowserForce);
  };
  test('Initial Tutorial Flow', async ({ tutorial, nodes, edges, goToLevelAtStage }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Go through initial popup and fixed popovers', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );
    });

    await test.step('Check initial nodes and edges', async () => {
      await assertNodesAreVisible(nodes);
      await assertEdgesAreVisible(edges);
    });
  });
});

test.describe('Stage 2 - Create Initial policies and attach them to group', () => {
  const verifyFinalState = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
    await nodes.expectMultipleVisible([
      PolicyNodeID.RDSManagePolicy1,
      PolicyNodeID.RDSManagePolicy2,
    ]);

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
  test('Policy creation workflow: create all policies first, then connect to groups', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create all policies first, then connect them', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy1',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);

      await verifyFinalState(nodes, edges);
    });
  });

  test('Policy creation workflow: create and connect each policy immediately', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create and connect policies one at a time', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy1',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);

      await verifyFinalState(nodes, edges);
    });
  });

  test('Policy creation workflow: create policies in reverse order', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create policies in reverse order, then connect', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy1',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);

      await verifyFinalState(nodes, edges);
    });
  });

  test('Policy creation workflow: connect policies to groups in reverse order', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Create all policies first, then connect in reverse order', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy1',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);

      await verifyFinalState(nodes, edges);
    });
  });

  test('Policy creation workflow: mixed approach with partial completion', async ({
    nodes,
    edges,
    goToLevelAtStage,
    popups,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete Policy 1 workflow, then Policy 2 workflow', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy1',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);

      await nodes.expectVisible(PolicyNodeID.RDSManagePolicy1);
      await edges.expectVisible(PolicyNodeID.RDSManagePolicy1, GroupNodeID.PeachTeam);

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'TestPolicy2',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy2, GroupNodeID.BowserForce);

      await verifyFinalState(nodes, edges);
    });
  });
});

test.describe('Stage 3 - Create Shared Policy for both groups', () => {
  const goThroughTutorialPopovers = async (tutorial: TutorialActions): Promise<void> => {
    await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
    await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
  };

  const createAndConnectSharedPolicy = async (
    nodes: NodeActions,
    popups: PopupActions
  ): Promise<void> => {
    await test.step('Create final policy', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        'FinalPolicy',
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3')
      );

      await nodes.expectVisible(PolicyNodeID.RDSSharedPolicy);
    });

    await test.step('Connect final policy to both groups', async () => {
      await nodes.connectNodes(PolicyNodeID.RDSSharedPolicy, GroupNodeID.PeachTeam);
      await nodes.connectNodes(PolicyNodeID.RDSSharedPolicy, GroupNodeID.BowserForce);
    });
  };

  test('Final policy creation workflow: create final policy and attach it to both groups', async ({
    goToLevelAtStage,
    tutorial,
    popups,
    nodes,
    edges,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage3');
    await goThroughTutorialPopovers(tutorial);
    await createAndConnectSharedPolicy(nodes, popups);

    await test.step('Verify final state', async () => {
      edges.expectMutlipleVisible([
        [PolicyNodeID.RDSSharedPolicy, GroupNodeID.PeachTeam],
        [PolicyNodeID.RDSSharedPolicy, GroupNodeID.BowserForce],
        [UserNodeID.Mario, ResourceNodeID.RDS1],
        [UserNodeID.Luigi, ResourceNodeID.RDS1],
        [UserNodeID.Bowser, ResourceNodeID.RDS2],
        [UserNodeID.Wario, ResourceNodeID.RDS2],
        [UserNodeID.Waluigi, ResourceNodeID.RDS2],
        [PolicyNodeID.RDSSharedPolicy, GroupNodeID.PeachTeam],
        [PolicyNodeID.RDSSharedPolicy, GroupNodeID.BowserForce],
      ]);
    });

    await test.step('Go through final fixed popover', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
    });
  });

  test('Final policy creation workflow: create shared policy with unused user entity', async ({
    goToLevelAtStage,
    page,
    tutorial,
    popups,
    nodes,
  }) => {
    await goToLevelAtStage(9, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Create and connect new shared policy groups\
       alongside an unused user popover', async () => {
      await goThroughTutorialPopovers(tutorial);
      await popups.submitCreateEntityPopup(
        'TestUser',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );
      await createAndConnectSharedPolicy(nodes, popups);
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
    });

    await test.step('Assert unnecessary edges and nodes warning', async () => {
      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
      const unnecessaryNode = findUnnecessaryNode(page);
      const unneccessaryNodeId = await unnecessaryNode.getAttribute('data-element-id');

      await nodes.deleteNode(unneccessaryNodeId!);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
    });

    await test.step('Expect level finished popup to be visible', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
    });
  });
});
