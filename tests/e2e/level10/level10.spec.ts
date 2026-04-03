import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { EntityCreationActions } from '../helpers/entity-creation-actions';
import { LevelProgressActions } from '../helpers/level-progress-actions';
import { findUnnecessaryNode } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { UIActions } from '../helpers/ui-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level10/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level10/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level10/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level10/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  UserNodeID,
  ResourceNodeID,
} from '@/levels/level10/types/node-ids';

const completeInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
};

const verifyInitialLevelSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectVisible(
    GroupNodeID.Engineering,
    UserNodeID.Sam,
    UserNodeID.Jordan,
    UserNodeID.Morgan,
    UserNodeID.Casey,
    UserNodeID.Taylor,
    UserNodeID.Alex
  );

  await edges.expectVisible(UserNodeID.Alex, GroupNodeID.Engineering);
  await edges.expectVisible(UserNodeID.Sam, GroupNodeID.Engineering);
  await edges.expectVisible(UserNodeID.Casey, GroupNodeID.Engineering);
  await edges.expectVisible(UserNodeID.Taylor, GroupNodeID.Engineering);
  await edges.expectVisible(UserNodeID.Morgan, GroupNodeID.Engineering);
  await edges.expectVisible(UserNodeID.Jordan, GroupNodeID.Engineering);
};

const createTBACPolicy = async (
  entities: EntityCreationActions,
  nodes: NodeActions,
  progress: LevelProgressActions,
  tutorial: TutorialActions
): Promise<void> => {
  await entities.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    PolicyNodeID.TBACPolicy,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
  );

  await nodes.expectVisible(PolicyNodeID.TBACPolicy);
  await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.TBACPolicy,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );
};

const connectTBACPolicyToGroup = async (
  nodes: NodeActions,
  edges: EdgeActions,
  progress: LevelProgressActions
): Promise<void> => {
  await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.Engineering);
  await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.Engineering);
  await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
};

const verifyEC2ResourcesAndCreatePolicy = async (
  tutorial: TutorialActions,
  nodes: NodeActions,
  entities: EntityCreationActions,
  progress: LevelProgressActions
): Promise<void> => {
  await nodes.expectVisible(
    ResourceNodeID.EC2Instance1,
    ResourceNodeID.EC2Instance2,
    ResourceNodeID.EC2Instance3
  );

  await entities.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    PolicyNodeID.EC2ManagePolicy,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
  );

  await nodes.expectVisible(PolicyNodeID.EC2ManagePolicy);
  await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.EC2ManagePolicy,
    POPOVER_TUTORIAL_MESSAGES[3].popover_title
  );
};

const connectEC2PolicyToGroup = async (
  nodes: NodeActions,
  edges: EdgeActions,
  progress: LevelProgressActions
): Promise<void> => {
  await nodes.connectNodes(PolicyNodeID.EC2ManagePolicy, GroupNodeID.Engineering);
  await edges.expectVisible(PolicyNodeID.EC2ManagePolicy, GroupNodeID.Engineering);

  await edges.expectMutlipleVisible([
    [UserNodeID.Alex, ResourceNodeID.EC2Instance1],
    [UserNodeID.Sam, ResourceNodeID.EC2Instance1],
    [UserNodeID.Morgan, ResourceNodeID.EC2Instance2],
    [UserNodeID.Jordan, ResourceNodeID.EC2Instance2],
    [UserNodeID.Casey, ResourceNodeID.EC2Instance3],
    [UserNodeID.Taylor, ResourceNodeID.EC2Instance3],
  ]);

  await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
};

const completeLevelFinishPopups = async (
  tutorial: TutorialActions,
  ui: UIActions
): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await ui.expectUnnecessaryEdgesNodesWarning(false);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
};

test.describe('Stage 1 - TBAC Request Tags Introduction', () => {
  test('Initial Tutorial and Setup Flow', async ({
    tutorial,
    nodes,
    edges,
    entities,
    progress,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial about TBAC Request Tags', async () => {
      await completeInitialTutorial(tutorial);
    });

    await test.step('Verify initial level setup', async () => {
      await verifyInitialLevelSetup(nodes, edges);
    });

    await test.step('Create TBAC Policy', async () => {
      await createTBACPolicy(entities, nodes, progress, tutorial);
    });
  });
});

test.describe('Stage 2 - Attach TBAC Policy to Group', () => {
  test('Connect TBAC policy to engineering group', async ({
    edges,
    nodes,
    progress,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to engineering group', async () => {
      await connectTBACPolicyToGroup(nodes, edges, progress);
    });
  });
});

test.describe('Stage 3 - Create EC2 Management Policy and Final Connections', () => {
  test('Create EC2 management policy', async ({
    entities,
    progress,
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Verify EC2 resources and create policy', async () => {
      await verifyEC2ResourcesAndCreatePolicy(tutorial, nodes, entities, progress);
    });
  });
});

test.describe('Stage 4 - Attach EC2 Management Policy and Complete Level', () => {
  test('Connect EC2 management policy and verify access', async ({
    edges,
    nodes,
    progress,
    goToLevelAtStage,
    tutorial,
    ui,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');

    await test.step('Verify initial popover message', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.EC2ManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Connect EC2 policy to engineering group and verify team access', async () => {
      await connectEC2PolicyToGroup(nodes, edges, progress);
    });

    await test.step('Complete level tutorial', async () => {
      await completeLevelFinishPopups(tutorial, ui);
    });
  });

  test('Verify unnecessary nodes warning appears and cleanup', async ({
    page,
    nodes,
    edges,
    entities,
    progress,
    goToLevelAtStage,
    tutorial,
    ui,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');

    await test.step('Verify initial popover message', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.EC2ManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Create unnecessary policy to test cleanup', async () => {
      await entities.createSpuriousPolicy();
    });

    await test.step('Connect EC2 policy to engineering group', async () => {
      await connectEC2PolicyToGroup(nodes, edges, progress);
    });

    await test.step('Trigger warning check', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
    });

    await test.step('Verify unnecessary nodes warning appears', async () => {
      await ui.expectUnnecessaryEdgesNodesWarning(true);
    });

    await test.step('Remove unnecessary node to complete level', async () => {
      const unnecessaryNode = findUnnecessaryNode(page);
      const unnecessaryNodeId = await unnecessaryNode.getAttribute('data-element-id');
      await nodes.deleteNode(unnecessaryNodeId!);
      await ui.expectUnnecessaryEdgesNodesWarning(false);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    tutorial,
    nodes,
    edges,
    entities,
    progress,
    goToLevelAtStage,
    ui,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial and TBAC policy creation', async () => {
      await completeInitialTutorial(tutorial);
      await verifyInitialLevelSetup(nodes, edges);
      await createTBACPolicy(entities, nodes, progress, tutorial);
    });

    await test.step('Complete Stage 2 - Attach TBAC policy to engineering group', async () => {
      await connectTBACPolicyToGroup(nodes, edges, progress);
    });

    await test.step('Complete Stage 3 - Create EC2 management policy', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await verifyEC2ResourcesAndCreatePolicy(tutorial, nodes, entities, progress);
    });

    await test.step('Complete Stage 4 - Attach EC2 policy and finish', async () => {
      await connectEC2PolicyToGroup(nodes, edges, progress);
      await completeLevelFinishPopups(tutorial, ui);
    });
  });
});
