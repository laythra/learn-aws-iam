import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { findUnnecessaryNode } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level10/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level10/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level10/tutorial_messages/popup-tutorial-messages';
import {
  GroupNodeID,
  PolicyNodeID,
  UserNodeID,
  ResourceNodeID,
} from '@/machines/level10/types/node-id-enums';

test.describe('Stage 1 - TBAC Request Tags Introduction', () => {
  const assertUsersAndGroupsVisible = async (nodes: NodeActions): Promise<void> => {
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
  };

  const assertInitialConnectionsVisible = async (edges: EdgeActions): Promise<void> => {
    await edges.expectVisible(UserNodeID.Davis, GroupNodeID.PaymentsTeam);
    await edges.expectVisible(UserNodeID.John, GroupNodeID.PaymentsTeam);

    await edges.expectVisible(UserNodeID.Johnson, GroupNodeID.AnalyticsTeam);
    await edges.expectVisible(UserNodeID.Michael, GroupNodeID.AnalyticsTeam);

    await edges.expectVisible(UserNodeID.Sarah, GroupNodeID.ComplianceTeam);
    await edges.expectVisible(UserNodeID.Smith, GroupNodeID.ComplianceTeam);
  };

  test('Initial Tutorial and Setup Flow', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial about TBAC Request Tags', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
    });

    await test.step('Verify initial level setup', async () => {
      await assertUsersAndGroupsVisible(nodes);
      await assertInitialConnectionsVisible(edges);
    });

    await test.step('Create TBAC Policy', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        PolicyNodeID.TBACPolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );

      await nodes.expectVisible(PolicyNodeID.TBACPolicy);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.TBACPolicy,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });
  });
});

test.describe('Stage 2 - Attach TBAC Policy to Groups', () => {
  test('Connection order: Analytics -> Payments -> Compliance', async ({
    edges,
    nodes,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to AnalyticsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
    });

    await test.step('Connect TBAC policy to PaymentsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
    });

    await test.step('Connect TBAC policy to ComplianceTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
    });
  });

  test('Connection order: Compliance -> Payments -> Analytics', async ({
    edges,
    nodes,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to ComplianceTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
    });

    await test.step('Connect TBAC policy to PaymentsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
    });

    await test.step('Connect TBAC policy to AnalyticsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
    });
  });

  test('Connection order: Analytics -> Compliance -> Payments', async ({
    edges,
    nodes,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to AnalyticsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
    });

    await test.step('Connect TBAC policy to ComplianceTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
    });

    await test.step('Connect TBAC policy to PaymentsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
    });
  });

  test('Connection order: Compliance -> Analytics -> Payments', async ({
    edges,
    nodes,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to ComplianceTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
    });

    await test.step('Connect TBAC policy to AnalyticsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
    });

    await test.step('Connect TBAC policy to PaymentsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
    });
  });

  test('Connection order: Payments -> Compliance -> Analytics', async ({
    edges,
    nodes,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Connect TBAC policy to PaymentsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
    });

    await test.step('Connect TBAC policy to ComplianceTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
    });

    await test.step('Connect TBAC policy to AnalyticsTeam group', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
    });
  });
});

test.describe('Stage 3 - Create RDS Management Policy and Final Connections', () => {
  test('Create RDS management policy', async ({ popups, nodes, tutorial, goToLevelAtStage }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage3');

    await test.step('Assert new RDS resources are created', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await nodes.expectVisible(ResourceNodeID.RDS1, ResourceNodeID.RDS2, ResourceNodeID.RDS3);
    });

    await test.step('Create RDS management policy', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        PolicyNodeID.RDSManagePolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );
    });

    await test.step('Verify RDS management policy appears', async () => {
      await nodes.expectVisible(PolicyNodeID.RDSManagePolicy);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });
  });
});

test.describe('Stage 4 - Attach RDS Management Policy and Complete Level', () => {
  const assertInitialPopoverMessage = async (tutorial: TutorialActions): Promise<void> => {
    await tutorial.expectPopoverWithoutNextButton(
      PolicyNodeID.RDSManagePolicy,
      POPOVER_TUTORIAL_MESSAGES[3].popover_title
    );
  };

  const connectNodesAndAssert = async (
    nodes: NodeActions,
    edges: EdgeActions,
    policyId: string,
    groupId: string
  ): Promise<void> => {
    await nodes.connectNodes(policyId, groupId);
    await edges.expectVisible(policyId, groupId);

    const groupToResourceMapping = {
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

    const mapping = groupToResourceMapping[groupId];

    await edges.expectMutlipleVisible(mapping.users.map(user => [user, mapping.resource]));
  };

  test('Connection order: Analytics -> Payments -> Compliance', async ({
    edges,
    nodes,
    goToLevelAtStage,
    tutorial,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');
    await assertInitialPopoverMessage(tutorial);

    await test.step('Connect in Analytics -> Payments -> Compliance order', async () => {
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.AnalyticsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.PaymentsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.ComplianceTeam
      );
    });

    await test.step('Complete level tutorial', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
    });
  });

  test('Connection order: Compliance -> Payments -> Analytics', async ({
    edges,
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');
    await assertInitialPopoverMessage(tutorial);

    await test.step('Connect in Compliance -> Payments -> Analytics order', async () => {
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.ComplianceTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.PaymentsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.AnalyticsTeam
      );
    });
  });

  test('Connection order: Analytics -> Compliance -> Payments', async ({
    edges,
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');
    await assertInitialPopoverMessage(tutorial);

    await test.step('Connect in Analytics -> Compliance -> Payments order', async () => {
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.AnalyticsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.ComplianceTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.PaymentsTeam
      );
    });
  });

  test('Connection order: Payments -> Compliance -> Analytics', async ({
    edges,
    nodes,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');
    await assertInitialPopoverMessage(tutorial);

    await test.step('Connect in Payments -> Compliance -> Analytics order', async () => {
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.PaymentsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.ComplianceTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.AnalyticsTeam
      );
    });
  });

  test('Complete workflow with spurious node cleanup', async ({
    page,
    nodes,
    edges,
    goToLevelAtStage,
    tutorial,
    popups,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');
    await assertInitialPopoverMessage(tutorial);

    await test.step('Create spurious node to test cleanup', async () => {
      await popups.submitCreateEntityPopup(
        'unusued-node',
        ElementID.CreateEntitiesMenuItem,
        ElementID.IAMIdentityCreatorPopup
      );
    });

    await test.step('Connect all policies in Analytics -> Payments -> Compliance', async () => {
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.AnalyticsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.PaymentsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.ComplianceTeam
      );
    });

    await test.step('Complete level with spurious node cleanup', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);

      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
      const unnecessaryNode = findUnnecessaryNode(page);
      const unnecessaryNodeId = await unnecessaryNode.getAttribute('data-element-id');
      await nodes.deleteNode(unnecessaryNodeId!);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);

      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
    });
  });

  test('Complete workflow without having a spurious node', async ({
    nodes,
    edges,
    goToLevelAtStage,
    tutorial,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage4');
    await assertInitialPopoverMessage(tutorial);

    await test.step('Connect all policies in Analytics -> Payments -> Compliance', async () => {
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.AnalyticsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.PaymentsTeam
      );
      await connectNodesAndAssert(
        nodes,
        edges,
        PolicyNodeID.RDSManagePolicy,
        GroupNodeID.ComplianceTeam
      );
    });

    await test.step('Complete level without having a spurious node', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
    });
  });
});

test.describe('Complete Level Workflow - End to End', () => {
  test('Complete level from start to finish - Analytics first order', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(10, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Stage 1: Complete initial tutorial', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);

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
    });

    await test.step('Stage 1: Create TBAC Policy', async () => {
      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        PolicyNodeID.TBACPolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
      );

      await nodes.expectVisible(PolicyNodeID.TBACPolicy);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.TBACPolicy,
        POPOVER_TUTORIAL_MESSAGES[1].popover_title
      );
    });

    await test.step('Stage 2: Connect TBAC policy Analytics->Payments->Compliance', async () => {
      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.AnalyticsTeam);

      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.PaymentsTeam);

      await nodes.connectNodes(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
      await edges.expectVisible(PolicyNodeID.TBACPolicy, GroupNodeID.ComplianceTeam);
    });

    await test.step('Stage 3: Create RDS management policy', async () => {
      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
      await nodes.expectVisible(ResourceNodeID.RDS1, ResourceNodeID.RDS2, ResourceNodeID.RDS3);

      await popups.submitCreatePolicyPopup(
        [ElementID.CodeEditorPolicyTab],
        ElementID.CodeEditorPolicyTab,
        PolicyNodeID.RDSManagePolicy,
        await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2')
      );

      await nodes.expectVisible(PolicyNodeID.RDSManagePolicy);
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
    });

    await test.step('Stage 4: Connect RDS management policy and complete level', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        PolicyNodeID.RDSManagePolicy,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy, GroupNodeID.AnalyticsTeam);
      await edges.expectVisible(PolicyNodeID.RDSManagePolicy, GroupNodeID.AnalyticsTeam);

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy, GroupNodeID.PaymentsTeam);
      await edges.expectVisible(PolicyNodeID.RDSManagePolicy, GroupNodeID.PaymentsTeam);

      await nodes.connectNodes(PolicyNodeID.RDSManagePolicy, GroupNodeID.ComplianceTeam);
      await edges.expectVisible(PolicyNodeID.RDSManagePolicy, GroupNodeID.ComplianceTeam);

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
    });
  });
});
