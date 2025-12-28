import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { findUnnecessaryNode } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/machines/level10/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level10/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level10/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level10/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  UserNodeID,
  ResourceNodeID,
} from '@/machines/level10/types/node-id-enums';
import { IAMNodeEntity } from '@/types/iam-enums';

const completeInitialTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
};

const verifyInitialLevelSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectVisible(
    GroupNodeID.PaymentsTeam,
    GroupNodeID.AnalyticsTeam,
    GroupNodeID.ComplianceTeam,
    UserNodeID.John,
    UserNodeID.Smith,
    UserNodeID.Sarah,
    UserNodeID.Johnson,
    UserNodeID.Michael,
    UserNodeID.Davis
  );

  await edges.expectVisible(UserNodeID.Davis, GroupNodeID.PaymentsTeam);
  await edges.expectVisible(UserNodeID.John, GroupNodeID.PaymentsTeam);
  await edges.expectVisible(UserNodeID.Johnson, GroupNodeID.AnalyticsTeam);
  await edges.expectVisible(UserNodeID.Michael, GroupNodeID.AnalyticsTeam);
  await edges.expectVisible(UserNodeID.Sarah, GroupNodeID.ComplianceTeam);
  await edges.expectVisible(UserNodeID.Smith, GroupNodeID.ComplianceTeam);
};

const createTBACPolicy = async (
  popups: PopupActions,
  nodes: NodeActions,
  tutorial: TutorialActions
): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    PolicyNodeID.TBACPolicy,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
  );

  await nodes.expectVisible(PolicyNodeID.TBACPolicy);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.TBACPolicy,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );
};

const connectTBACPolicyToGroups = async (
  nodes: NodeActions,
  edges: EdgeActions,
  groups: string[]
): Promise<void> => {
  for (const group of groups) {
    await nodes.connectNodes(PolicyNodeID.TBACPolicy, group);
    await edges.expectVisible(PolicyNodeID.TBACPolicy, group);
  }
};

const verifyRDSResourcesAndCreatePolicy = async (
  tutorial: TutorialActions,
  nodes: NodeActions,
  popups: PopupActions
): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
  await nodes.expectVisible(ResourceNodeID.RDS1, ResourceNodeID.RDS2, ResourceNodeID.RDS3);

  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    PolicyNodeID.RDSManagePolicy,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
  );

  await nodes.expectVisible(PolicyNodeID.RDSManagePolicy);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
  await tutorial.expectPopoverWithoutNextButton(
    PolicyNodeID.RDSManagePolicy,
    POPOVER_TUTORIAL_MESSAGES[3].popover_title
  );
};

const connectRDSPolicyToGroups = async (
  nodes: NodeActions,
  edges: EdgeActions,
  popups: PopupActions,
  groups: string[]
): Promise<void> => {
  const groupToResourceMapping: Record<string, { users: string[]; resource: string }> = {
    [GroupNodeID.ComplianceTeam]: {
      users: [UserNodeID.Sarah, UserNodeID.Smith],
      resource: ResourceNodeID.RDS2,
    },
    [GroupNodeID.AnalyticsTeam]: {
      users: [UserNodeID.Johnson, UserNodeID.Michael],
      resource: ResourceNodeID.RDS3,
    },
    [GroupNodeID.PaymentsTeam]: {
      users: [UserNodeID.Davis, UserNodeID.John],
      resource: ResourceNodeID.RDS1,
    },
  };

  for (const group of groups) {
    await nodes.connectNodes(PolicyNodeID.RDSManagePolicy, group);
    await edges.expectVisible(PolicyNodeID.RDSManagePolicy, group);

    const mapping = groupToResourceMapping[group];
    await edges.expectMutlipleVisible(mapping.users.map(user => [user, mapping.resource]));
  }
};

const completeLevelFinishPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
  await tutorial.expectUnnecessaryEdgesNodesWarning(false);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
};

test.describe('Stage 1 - TBAC Request Tags Introduction', () => {
  test('Initial Tutorial and Setup Flow', async ({
    tutorial,
    nodes,
    edges,
    popups,
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
      await createTBACPolicy(popups, nodes, tutorial);
    });
  });
});

test.describe('Stage 2 - Attach TBAC Policy to Groups', () => {
  test('Connection order: Analytics -> Payments -> Compliance', async ({
    edges,
    nodes,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to all groups', async () => {
      await connectTBACPolicyToGroups(nodes, edges, [
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.PaymentsTeam,
        GroupNodeID.ComplianceTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });
  });

  test('Connection order: Compliance -> Payments -> Analytics', async ({
    edges,
    nodes,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to all groups', async () => {
      await connectTBACPolicyToGroups(nodes, edges, [
        GroupNodeID.ComplianceTeam,
        GroupNodeID.PaymentsTeam,
        GroupNodeID.AnalyticsTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });
  });

  test('Connection order: Analytics -> Compliance -> Payments', async ({
    edges,
    nodes,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to all groups', async () => {
      await connectTBACPolicyToGroups(nodes, edges, [
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.ComplianceTeam,
        GroupNodeID.PaymentsTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });
  });

  test('Connection order: Compliance -> Analytics -> Payments', async ({
    edges,
    nodes,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to all groups', async () => {
      await connectTBACPolicyToGroups(nodes, edges, [
        GroupNodeID.ComplianceTeam,
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.PaymentsTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });
  });

  test('Connection order: Payments -> Compliance -> Analytics', async ({
    edges,
    nodes,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to all groups', async () => {
      await connectTBACPolicyToGroups(nodes, edges, [
        GroupNodeID.PaymentsTeam,
        GroupNodeID.ComplianceTeam,
        GroupNodeID.AnalyticsTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });
  });
});

test.describe('Stage 3 - Create RDS Management Policy and Final Connections', () => {
  test('Create RDS management policy', async ({ popups, nodes, tutorial, goToLevelAtStage }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Verify RDS resources and create policy', async () => {
      await verifyRDSResourcesAndCreatePolicy(tutorial, nodes, popups);
    });
  });
});

test.describe('Stage 4 - Attach RDS Management Policy and Complete Level', () => {
  test('Connection order: Analytics -> Payments -> Compliance', async ({
    edges,
    nodes,
    popups,
    goToLevelAtStage,
    tutorial,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');

    await test.step('Verify initial popover message', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Connect RDS policy to all groups and verify access', async () => {
      await connectRDSPolicyToGroups(nodes, edges, popups, [
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.PaymentsTeam,
        GroupNodeID.ComplianceTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Complete level tutorial', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Connection order: Compliance -> Payments -> Analytics', async ({
    edges,
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');

    await test.step('Verify initial popover message', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Connect RDS policy to all groups and verify access', async () => {
      await connectRDSPolicyToGroups(nodes, edges, popups, [
        GroupNodeID.ComplianceTeam,
        GroupNodeID.PaymentsTeam,
        GroupNodeID.AnalyticsTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Complete level tutorial', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Connection order: Analytics -> Compliance -> Payments', async ({
    edges,
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');

    await test.step('Verify initial popover message', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Connect RDS policy to all groups and verify access', async () => {
      await connectRDSPolicyToGroups(nodes, edges, popups, [
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.ComplianceTeam,
        GroupNodeID.PaymentsTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Complete level tutorial', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Connection order: Payments -> Compliance -> Analytics', async ({
    edges,
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');

    await test.step('Verify initial popover message', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Connect RDS policy to all groups and verify access', async () => {
      await connectRDSPolicyToGroups(nodes, edges, popups, [
        GroupNodeID.PaymentsTeam,
        GroupNodeID.ComplianceTeam,
        GroupNodeID.AnalyticsTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Complete level tutorial', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Verify unnecessary nodes warning appears and cleanup', async ({
    page,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
    tutorial,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');

    await test.step('Verify initial popover message', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Create unnecessary node to test cleanup', async () => {
      await popups.createUserGroupNode(
        'unused-node',
        ElementID.CreateUserGroupMenuItem,
        ElementID.IAMIdentityCreatorPopup,
        IAMNodeEntity.Group
      );
    });

    await test.step('Connect all policies', async () => {
      await connectRDSPolicyToGroups(nodes, edges, popups, [
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.PaymentsTeam,
        GroupNodeID.ComplianceTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Trigger warning check', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
    });

    await test.step('Verify unnecessary nodes warning appears', async () => {
      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
    });

    await test.step('Remove unnecessary node to complete level', async () => {
      const unnecessaryNode = findUnnecessaryNode(page);
      const unnecessaryNodeId = await unnecessaryNode.getAttribute('data-element-id');
      await nodes.deleteNode(unnecessaryNodeId!);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
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
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Initial tutorial and TBAC policy creation', async () => {
      await completeInitialTutorial(tutorial);
      await verifyInitialLevelSetup(nodes, edges);
      await createTBACPolicy(popups, nodes, tutorial);
    });

    await test.step('Complete Stage 2 - Attach TBAC policy to groups', async () => {
      await connectTBACPolicyToGroups(nodes, edges, [
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.PaymentsTeam,
        GroupNodeID.ComplianceTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
    });

    await test.step('Complete Stage 3 - Create RDS management policy', async () => {
      await verifyRDSResourcesAndCreatePolicy(tutorial, nodes, popups);
    });

    await test.step('Complete Stage 4 - Attach RDS policy and finish', async () => {
      await connectRDSPolicyToGroups(nodes, edges, popups, [
        GroupNodeID.AnalyticsTeam,
        GroupNodeID.PaymentsTeam,
        GroupNodeID.ComplianceTeam,
      ]);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
      await completeLevelFinishPopups(tutorial);
    });
  });
});
