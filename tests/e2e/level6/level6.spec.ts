import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EntityCreationActions } from '../helpers/entity-creation-actions';
import { LevelProgressActions } from '../helpers/level-progress-actions';
import { findUnnecessaryNode } from '../helpers/locator-helpers';
import { NodeActions } from '../helpers/node-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level6/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level6/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level6/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level6/tutorial_messages/popup-tutorial-messages';
import { AccountID, PolicyNodeID, RoleNodeID, UserNodeID } from '@/levels/level6/types/node-ids';

const completeTutorialPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);

  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[0].popover_title);
};

const createDynamoDBReadPolicy = async (
  nodes: NodeActions,
  entities: EntityCreationActions,
  progress: LevelProgressActions
): Promise<void> => {
  await entities.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'dynamodb-read-policy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1'),
    AccountID.TrustingAccount
  );
  await nodes.expectVisible(PolicyNodeID.TrustingAccountFinanceReportsReadPolicy);
  await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);
};

const createDynamoDBReadRole = async (
  nodes: NodeActions,
  entities: EntityCreationActions,
  progress: LevelProgressActions
): Promise<void> => {
  await entities.submitCreatePolicyPopup(
    [ElementID.CodeEditorRoleTab],
    ElementID.CodeEditorRoleTab,
    // Role name must match 'dynamodb-read-role' for `assume-role-policy` reference
    'dynamodb-read-role',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'role1'),
    AccountID.TrustingAccount
  );

  await nodes.expectVisible(RoleNodeID.TrustingAccountDynamoDBReadRole);
  await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);
};

const createAssumeRolePolicy = async (
  nodes: NodeActions,
  entities: EntityCreationActions,
  progress: LevelProgressActions
): Promise<void> => {
  await entities.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    'assume-role-policy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy2'),
    AccountID.TrustedAccount
  );
  await nodes.expectVisible(PolicyNodeID.TrustedAccountAssumeRolePolicy);
  await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][2].id);
};

const connectDynamoDBPolicyToRole = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(
    PolicyNodeID.TrustingAccountFinanceReportsReadPolicy,
    RoleNodeID.TrustingAccountDynamoDBReadRole
  );
};

const connectAssumeRolePolicyToUser = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(
    PolicyNodeID.TrustedAccountAssumeRolePolicy,
    UserNodeID.TrustedAccountIAMUser
  );
};

const connectUserToRole = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(
    UserNodeID.TrustedAccountIAMUser,
    RoleNodeID.TrustingAccountDynamoDBReadRole
  );
};

const completeLevelFinishPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopoverAndClickNext(
    UserNodeID.TrustedAccountIAMUser,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
};

const createUnnecessaryNode = async (entities: EntityCreationActions): Promise<void> => {
  await entities.submitCreatePolicyPopup(
    [ElementID.CodeEditorRoleTab],
    ElementID.CodeEditorRoleTab,
    'unnecessary-policy',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy3'),
    AccountID.TrustingAccount
  );
};

test.describe('Stage 1 - Cross Account Access Tutorial Introduction', () => {
  test('Initial Tutorial Flow', async ({ tutorial, goToLevelAtStage }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });
  });
});

test.describe('Stage 2 - Creating Cross Account Access in all orders', () => {
  test('Order 1: Create Policy, Role, AssumePolicy, then connect in sequence', async ({
    nodes,
    entities,
    progress,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create all entities and connect them', async () => {
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await createDynamoDBReadRole(nodes, entities, progress);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Order 2: Create Role first, then Policy, then connections', async ({
    nodes,
    entities,
    progress,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create all entities and connect them', async () => {
      await createDynamoDBReadRole(nodes, entities, progress);
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Order 3: Create Policy, connect as role created, finish with connections', async ({
    nodes,
    entities,
    progress,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create all entities and connect them', async () => {
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await createDynamoDBReadRole(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Order 4: Role, Policy, connect them, then AssumePolicy and connections', async ({
    nodes,
    entities,
    progress,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create all entities and connect them', async () => {
      await createDynamoDBReadRole(nodes, entities, progress);
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Order 5: Create all entities first, then make all connections', async ({
    nodes,
    entities,
    progress,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create all entities and connect them', async () => {
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await createDynamoDBReadRole(nodes, entities, progress);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Order 6: Create AssumeRolePolicy before connecting user to role', async ({
    tutorial,
    nodes,
    entities,
    progress,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create all entities and connections', async () => {
      await createDynamoDBReadRole(nodes, entities, progress);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Verify level completion', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });

  test('Verify unnecessary edges / nodes warning appears', async ({
    page,
    tutorial,
    ui,
    nodes,
    entities,
    progress,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create cross-account access entities with unnecessary node', async () => {
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await createDynamoDBReadRole(nodes, entities, progress);
      await createUnnecessaryNode(entities);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Click next on completion popover to trigger warning check', async () => {
      await tutorial.expectPopoverAndClickNext(
        UserNodeID.TrustedAccountIAMUser,
        POPOVER_TUTORIAL_MESSAGES[0].popover_title
      );
    });

    await test.step('Verify unnecessary edges warning appears', async () => {
      await ui.expectUnnecessaryEdgesNodesWarning(true);
    });

    await test.step('Remove unnecessary edges and nodes to complete level', async () => {
      const unnecessaryNode = findUnnecessaryNode(page);
      await unnecessaryNode.click();
      await page.keyboard.press('Backspace');

      await ui.expectUnnecessaryEdgesNodesWarning(false);
    });
  });

  test('Handles blocked connections - shows insufficient permissions', async ({
    tutorial,
    ui,
    nodes,
    edges,
    entities,
    progress,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete tutorial', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create role and policy in trusting account', async () => {
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await createDynamoDBReadRole(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
    });

    await test.step('Attempt to connect user to role without assume role policy', async () => {
      await nodes.connectNodes(
        UserNodeID.TrustedAccountIAMUser,
        RoleNodeID.TrustingAccountDynamoDBReadRole
      );

      await ui.expectInsufficientPermissionsWarning();

      await edges.expectHidden(
        UserNodeID.TrustedAccountIAMUser,
        RoleNodeID.TrustingAccountDynamoDBReadRole
      );
    });

    await test.step('Create assume role policy and attach to user \
      - unblocks connection', async () => {
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectAssumeRolePolicyToUser(nodes);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    tutorial,
    nodes,
    entities,
    progress,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(6, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete tutorial', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Create cross-account access entities and connections', async () => {
      await createDynamoDBReadPolicy(nodes, entities, progress);
      await createDynamoDBReadRole(nodes, entities, progress);
      await createAssumeRolePolicy(nodes, entities, progress);
      await connectDynamoDBPolicyToRole(nodes);
      await connectAssumeRolePolicyToUser(nodes);
      await connectUserToRole(nodes);

      await progress.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopups(tutorial);
    });
  });
});
