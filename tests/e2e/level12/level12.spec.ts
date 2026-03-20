import { ENCODED_TEST_SOLUTIONS, ENCODED_LEVEL_STAGES } from './data';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/levels/level12/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/levels/level12/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/levels/level12/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/levels/level12/tutorial_messages/popup-tutorial-messages';
import {
  AccountID,
  GroupNodeID,
  OUNodeID,
  PermissionBoundaryID,
  PolicyNodeID,
  ResourceNodeID,
  RoleNodeID,
  SCPNodeID,
  UserNodeID,
} from '@/levels/level12/types/node-ids';
import { HandleID } from '@/types/iam-enums';

const completeTutorialPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
};

const verifyTutorialInitialSetup = async (nodes: NodeActions): Promise<void> => {
  await nodes.expectVisible(
    OUNodeID.TutorialOU,
    AccountID.TutorialStagingAccount,
    AccountID.TutorialProdAccount,
    SCPNodeID.DefaultSCP,
    UserNodeID.TutorialMorgan,
    UserNodeID.TutorialSam,
    UserNodeID.TutorialAlex,
    UserNodeID.TutorialTaylor,
    UserNodeID.TutorialCasey,
    UserNodeID.TutorialJordan,
    GroupNodeID.TutorialProdTeamGroup,
    GroupNodeID.TutorialStagingTeamGroup,
    PolicyNodeID.TutorialStagingCloudTrailAccess,
    PolicyNodeID.TutorialProdCloudTrailAccess,
    ResourceNodeID.TutorialCloudTrailStaging,
    ResourceNodeID.TutorialCloudTrailProd
  );
};

const navigateTutorialPopovers = async (
  tutorial: TutorialActions,
  nodes: NodeActions
): Promise<void> => {
  await tutorial.expectPopoverAndClickNext(
    OUNodeID.TutorialOU,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );

  await tutorial.expectPopoverAndClickNext(
    AccountID.TutorialProdAccount,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );

  await tutorial.expectPopoverWithoutNextButton(
    SCPNodeID.DefaultSCP,
    POPOVER_TUTORIAL_MESSAGES[2].popover_title
  );

  await nodes.openNodePopover(SCPNodeID.DefaultSCP, 'content');
  await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[0].popover_title);
  await nodes.closeNodePopover(SCPNodeID.DefaultSCP, 'content');
};

const createCloudTrailSCP = async (nodes: NodeActions, popups: PopupActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorSCPTab],
    ElementID.CodeEditorSCPTab,
    SCPNodeID.BlockCloudTrailDeletionSCP,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'policy1')
  );

  await nodes.expectVisible(SCPNodeID.BlockCloudTrailDeletionSCP);
};

const connectSCPToOU = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(SCPNodeID.BlockCloudTrailDeletionSCP, OUNodeID.TutorialOU);
};

const completeTutorialPhase = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[1].popover_title);
};

// ==================== Stage 2 Helper Functions ====================

const createEC2RegionSCP = async (nodes: NodeActions, popups: PopupActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorSCPTab],
    ElementID.CodeEditorSCPTab,
    SCPNodeID.RestrictEC2RegionSCP,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'ec2RegionSCP')
  );

  await nodes.expectVisible(SCPNodeID.RestrictEC2RegionSCP);
};

const connectEC2SCPToStagingAccount = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(
    SCPNodeID.RestrictEC2RegionSCP,
    AccountID.InLevelStagingAccount,
    HandleID.Left,
    HandleID.Top
  );
};

const createPermissionBoundary = async (
  nodes: NodeActions,
  popups: PopupActions
): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPermissionBoundaryTab],
    ElementID.CodeEditorPermissionBoundaryTab,
    PermissionBoundaryID.Ec2LaunchPermissionBoundary,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'permissionBoundary1')
  );

  await nodes.expectVisible(PermissionBoundaryID.Ec2LaunchPermissionBoundary);
};

const createAccessDelegationPolicy = async (
  nodes: NodeActions,
  popups: PopupActions
): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    PolicyNodeID.AccessDelegationPolicy,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'accessDelegationPolicy'),
    AccountID.InLevelStagingAccount
  );

  await nodes.expectVisible(PolicyNodeID.AccessDelegationPolicy);
};

const connectPBAndPolicyForObjective2 = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(
    PermissionBoundaryID.Ec2LaunchPermissionBoundary,
    RoleNodeID.EC2LaunchRole
  );
  await nodes.connectNodes(PolicyNodeID.AccessDelegationPolicy, UserNodeID.Alex);
};

const createS3WriteRole = async (nodes: NodeActions, popups: PopupActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorRoleTab],
    ElementID.CodeEditorRoleTab,
    RoleNodeID.S3WriteAccessRole,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'ec2TrustPolicy'),
    AccountID.InLevelStagingAccount
  );

  await nodes.expectVisible(RoleNodeID.S3WriteAccessRole);
};
const createS3WritePolicy = async (nodes: NodeActions, popups: PopupActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    PolicyNodeID.S3WriteAccessPolicy,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 's3WritePolicy'),
    AccountID.InLevelStagingAccount
  );

  await nodes.expectVisible(PolicyNodeID.S3WriteAccessPolicy);
};

const connectRoleAndPolicyForObjective3 = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(ResourceNodeID.InLevelStagingEC2Instance, RoleNodeID.S3WriteAccessRole);
  await nodes.connectNodes(PolicyNodeID.S3WriteAccessPolicy, RoleNodeID.S3WriteAccessRole);
};

const createElastiCachePolicy = async (nodes: NodeActions, popups: PopupActions): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorPolicyTab],
    ElementID.CodeEditorPolicyTab,
    PolicyNodeID.ElasticCacheManagementPolicy,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'elasticacheManagePolicy'),
    AccountID.InLevelProdAccount
  );

  await nodes.expectVisible(PolicyNodeID.ElasticCacheManagementPolicy);
};

const connectElastiCachePolicyToGroups = async (nodes: NodeActions): Promise<void> => {
  await nodes.connectNodes(
    PolicyNodeID.ElasticCacheManagementPolicy,
    GroupNodeID.InLevelSearchTeamGroup
  );
  await nodes.connectNodes(
    PolicyNodeID.ElasticCacheManagementPolicy,
    GroupNodeID.InLevelNotificationsTeamGroup
  );
  await nodes.connectNodes(
    PolicyNodeID.ElasticCacheManagementPolicy,
    GroupNodeID.InLevelPaymentsTeamGroup
  );
};

const completeLevelFinishPopup = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectPopupWithGoToNextLevelButton(POPUP_TUTORIAL_MESSAGES[3].title);
};

test.describe('Stage 1 - Tutorial Phase: Understanding SCPs and Organizational Units', () => {
  test('Initial Tutorial Flow', async ({ tutorial, nodes, popups, goToLevelAtStage }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete tutorial popups', async () => {
      await completeTutorialPopups(tutorial);
    });

    await test.step('Verify initial tutorial setup with OU and accounts', async () => {
      await verifyTutorialInitialSetup(nodes);
    });

    await test.step('Navigate through tutorial popovers about SCPs', async () => {
      await navigateTutorialPopovers(tutorial, nodes);
    });

    await test.step('Create CloudTrail deletion blocking SCP', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
      await createCloudTrailSCP(nodes, popups);
    });

    await test.step('Connect SCP to OU', async () => {
      await tutorial.expectPopoverWithoutNextButton(
        SCPNodeID.BlockCloudTrailDeletionSCP,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );
      await connectSCPToOU(nodes);
    });

    await test.step('Complete tutorial phase', async () => {
      await completeTutorialPhase(tutorial);
    });
  });
});

test.describe('Stage 2 - Main Challenge: All Objectives Completion Orders', () => {
  test('Order 1: SCP → PB+Policy → Role+Policy → ElastiCache', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete intro popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
      await tutorial.closeSidePanel();
    });

    await test.step('Objective 1: Restrict EC2 Region', async () => {
      await createEC2RegionSCP(nodes, popups);
      await connectEC2SCPToStagingAccount(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Objective 2: Delegate EC2 Launching', async () => {
      await createPermissionBoundary(nodes, popups);
      await createAccessDelegationPolicy(nodes, popups);
      await connectPBAndPolicyForObjective2(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Objective 3: Enable EC2 to S3 Communication', async () => {
      await createS3WriteRole(nodes, popups);
      await createS3WritePolicy(nodes, popups);
      await connectRoleAndPolicyForObjective3(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);
    });

    await test.step('Objective 4: ElastiCache Access Management', async () => {
      await createElastiCachePolicy(nodes, popups);
      await connectElastiCachePolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopup(tutorial);
    });
  });

  test('Order 2: ElastiCache → Role+Policy → PB+Policy → SCP', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete intro popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
      await tutorial.closeSidePanel();
    });

    await test.step('Objective 4: ElastiCache Access Management', async () => {
      await createElastiCachePolicy(nodes, popups);
      await connectElastiCachePolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][3].id);
    });

    await test.step('Objective 3: Enable EC2 to S3 Communication', async () => {
      await createS3WriteRole(nodes, popups);
      await createS3WritePolicy(nodes, popups);
      await connectRoleAndPolicyForObjective3(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);
    });

    await test.step('Objective 2: Delegate EC2 Launching', async () => {
      await createPermissionBoundary(nodes, popups);
      await createAccessDelegationPolicy(nodes, popups);
      await connectPBAndPolicyForObjective2(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Objective 1: Restrict EC2 Region', async () => {
      await createEC2RegionSCP(nodes, popups);
      await connectEC2SCPToStagingAccount(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopup(tutorial);
    });
  });

  test('Order 3: PB first, then Policy for Objective 2', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete intro popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
      await tutorial.closeSidePanel();
    });

    await test.step('Objective 2: Create Permission Boundary first', async () => {
      await createPermissionBoundary(nodes, popups);
    });

    await test.step('Objective 1: Restrict EC2 Region', async () => {
      await createEC2RegionSCP(nodes, popups);
      await connectEC2SCPToStagingAccount(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Objective 2: Complete with Access Delegation Policy', async () => {
      await createAccessDelegationPolicy(nodes, popups);
      await connectPBAndPolicyForObjective2(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Objective 3: Enable EC2 to S3 Communication', async () => {
      await createS3WriteRole(nodes, popups);
      await createS3WritePolicy(nodes, popups);
      await connectRoleAndPolicyForObjective3(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);
    });

    await test.step('Objective 4: ElastiCache Access Management', async () => {
      await createElastiCachePolicy(nodes, popups);
      await connectElastiCachePolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopup(tutorial);
    });
  });

  test('Order 4: Role first, then Policy for Objective 3', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete intro popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
      await tutorial.closeSidePanel();
    });

    await test.step('Objective 3: Create Role first', async () => {
      await createS3WriteRole(nodes, popups);
    });

    await test.step('Objective 1: Restrict EC2 Region', async () => {
      await createEC2RegionSCP(nodes, popups);
      await connectEC2SCPToStagingAccount(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Objective 3: Complete with S3 Write Policy', async () => {
      await createS3WritePolicy(nodes, popups);
      await connectRoleAndPolicyForObjective3(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);
    });

    await test.step('Objective 2: Delegate EC2 Launching', async () => {
      await createPermissionBoundary(nodes, popups);
      await createAccessDelegationPolicy(nodes, popups);
      await connectPBAndPolicyForObjective2(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Objective 4: ElastiCache Access Management', async () => {
      await createElastiCachePolicy(nodes, popups);
      await connectElastiCachePolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopup(tutorial);
    });
  });

  test('Order 5: Connect ElastiCache policy to groups in different order', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete intro popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
      await tutorial.closeSidePanel();
    });

    await test.step('Objective 1: Restrict EC2 Region', async () => {
      await createEC2RegionSCP(nodes, popups);
      await connectEC2SCPToStagingAccount(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Objective 2: Delegate EC2 Launching', async () => {
      await createPermissionBoundary(nodes, popups);
      await createAccessDelegationPolicy(nodes, popups);
      await connectPBAndPolicyForObjective2(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Objective 3: Enable EC2 to S3 Communication', async () => {
      await createS3WriteRole(nodes, popups);
      await createS3WritePolicy(nodes, popups);
      await connectRoleAndPolicyForObjective3(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);
    });

    await test.step('Objective 4: Connect groups in reverse order', async () => {
      await createElastiCachePolicy(nodes, popups);
      // Connect in different order: Payments → Notifications → Search
      await nodes.connectNodes(
        PolicyNodeID.ElasticCacheManagementPolicy,
        GroupNodeID.InLevelPaymentsTeamGroup
      );
      await nodes.connectNodes(
        PolicyNodeID.ElasticCacheManagementPolicy,
        GroupNodeID.InLevelNotificationsTeamGroup
      );
      await nodes.connectNodes(
        PolicyNodeID.ElasticCacheManagementPolicy,
        GroupNodeID.InLevelSearchTeamGroup
      );
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopup(tutorial);
    });
  });

  test('Order 6: Mixed order - interleaving objectives', async ({
    nodes,
    popups,
    tutorial,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete intro popup', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
      await tutorial.closeSidePanel();
    });

    await test.step('Start Objective 2: Create Permission Boundary', async () => {
      await createPermissionBoundary(nodes, popups);
    });

    await test.step('Start Objective 3: Create Role', async () => {
      await createS3WriteRole(nodes, popups);
    });

    await test.step('Complete Objective 1: Restrict EC2 Region', async () => {
      await createEC2RegionSCP(nodes, popups);
      await connectEC2SCPToStagingAccount(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);
    });

    await test.step('Start Objective 4: Create ElastiCache Policy', async () => {
      await createElastiCachePolicy(nodes, popups);
    });

    await test.step('Complete Objective 3: Connect Role and Policy', async () => {
      await createS3WritePolicy(nodes, popups);
      await connectRoleAndPolicyForObjective3(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);
    });

    await test.step('Complete Objective 2: Connect PB and Policy', async () => {
      await createAccessDelegationPolicy(nodes, popups);
      await connectPBAndPolicyForObjective2(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);
    });

    await test.step('Complete Objective 4: Connect to all groups', async () => {
      await connectElastiCachePolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][3].id);
    });

    await test.step('Complete level', async () => {
      await completeLevelFinishPopup(tutorial);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    tutorial,
    nodes,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(12, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Stage 1: Complete tutorial phase', async () => {
      await completeTutorialPopups(tutorial);
      await verifyTutorialInitialSetup(nodes);
      await navigateTutorialPopovers(tutorial, nodes);

      await tutorial.expectPopoverWithoutNextButton(
        ElementID.NewEntityBtn,
        POPOVER_TUTORIAL_MESSAGES[3].popover_title
      );
      await createCloudTrailSCP(nodes, popups);

      await tutorial.expectPopoverWithoutNextButton(
        SCPNodeID.BlockCloudTrailDeletionSCP,
        POPOVER_TUTORIAL_MESSAGES[4].popover_title
      );
      await connectSCPToOU(nodes);

      await completeTutorialPhase(tutorial);
    });

    await test.step('Stage 2: Complete all objectives', async () => {
      await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
      await tutorial.closeSidePanel();

      await createEC2RegionSCP(nodes, popups);
      await connectEC2SCPToStagingAccount(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][0].id);

      await createPermissionBoundary(nodes, popups);
      await createAccessDelegationPolicy(nodes, popups);
      await connectPBAndPolicyForObjective2(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][1].id);

      await createS3WriteRole(nodes, popups);
      await createS3WritePolicy(nodes, popups);
      await connectRoleAndPolicyForObjective3(nodes);
      await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[1][2].id);

      await createElastiCachePolicy(nodes, popups);
      await connectElastiCachePolicyToGroups(nodes);
      await popups.expectLevelObjectiveCompleteToast(LEVEL_OBJECTIVES[1][3].id);

      await completeLevelFinishPopup(tutorial);
    });
  });
});
