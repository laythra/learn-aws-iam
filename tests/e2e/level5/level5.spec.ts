import { ENCODED_LEVEL_STAGES, ENCODED_TEST_SOLUTIONS } from './data';
import { EdgeActions } from '../helpers/edge-actions';
import { NodeActions } from '../helpers/node-actions';
import { PopupActions } from '../helpers/popup-actions';
import { test } from '../helpers/test-fixtures';
import { getTestSolution } from '../helpers/test-solutions';
import { TutorialActions } from '../helpers/tutorial-actions';
import { ElementID } from '@/config/element-ids';
import { LEVEL_OBJECTIVES } from '@/machines/level5/objectives/level-objectives';
import { FIXED_POPOVER_MESSAGES } from '@/machines/level5/tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from '@/machines/level5/tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from '@/machines/level5/tutorial_messages/popup-tutorial-messages';
import {
  PolicyNodeID,
  ResourceNodeID,
  RoleNodeID,
  UserNodeID,
} from '@/machines/level5/types/node-id-enums';

const completeInitialPopupTutorial = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[0].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[1].title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[2].title);
};

const verifyInitialLevelSetup = async (nodes: NodeActions, edges: EdgeActions): Promise<void> => {
  await nodes.expectVisible(
    PolicyNodeID.BillingPolicy,
    PolicyNodeID.S3ReadPolicy,
    UserNodeID.FinanceUser,
    RoleNodeID.FinanceAuditorRole,
    ResourceNodeID.BillingAndCostManagement,
    ResourceNodeID.FinanceS3Bucket
  );

  await edges.expectVisible(PolicyNodeID.BillingPolicy, RoleNodeID.FinanceAuditorRole);
};

const completeTrustPolicyExplanation = async (
  tutorial: TutorialActions,
  nodes: NodeActions
): Promise<void> => {
  await tutorial.expectPopoverWithoutNextButton(
    RoleNodeID.FinanceAuditorRole,
    POPOVER_TUTORIAL_MESSAGES[0].popover_title
  );

  await nodes.openNodePopover(RoleNodeID.FinanceAuditorRole, 'content');
  await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[0].popover_title);
  await nodes.closeNodePopover(RoleNodeID.FinanceAuditorRole, 'content');
};

const attachFinanceUserToAuditorRole = async (
  tutorial: TutorialActions,
  nodes: NodeActions,
  edges: EdgeActions,
  popups: PopupActions
): Promise<void> => {
  await tutorial.expectFixedPopoverWithoutNextButton(FIXED_POPOVER_MESSAGES[1].popover_title);
  await nodes.connectNodes(UserNodeID.FinanceUser, RoleNodeID.FinanceAuditorRole);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][0].id);

  await edges.expectVisible(UserNodeID.FinanceUser, ResourceNodeID.BillingAndCostManagement);

  await tutorial.expectPopoverAndClickNext(
    ResourceNodeID.BillingAndCostManagement,
    POPOVER_TUTORIAL_MESSAGES[1].popover_title
  );
};

const createS3ReadAccessRole = async (
  tutorial: TutorialActions,
  nodes: NodeActions,
  popups: PopupActions
): Promise<void> => {
  await tutorial.expectPopoverWithoutNextButton(
    ElementID.NewEntityBtn,
    POPOVER_TUTORIAL_MESSAGES[2].popover_title
  );

  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorRoleTab],
    ElementID.CodeEditorRoleTab,
    'finance-s3-read-role',
    await getTestSolution(ENCODED_TEST_SOLUTIONS, 'role1')
  );

  await nodes.expectVisible(RoleNodeID.S3ReadAccessRole);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][1].id);

  await tutorial.expectPopoverAndClickNext(
    RoleNodeID.S3ReadAccessRole,
    POPOVER_TUTORIAL_MESSAGES[3].popover_title
  );
  await tutorial.expectPopoverAndClickNext(
    RoleNodeID.S3ReadAccessRole,
    POPOVER_TUTORIAL_MESSAGES[4].popover_title
  );
  await tutorial.expectPopoverWithoutNextButton(
    UserNodeID.FinanceUser,
    POPOVER_TUTORIAL_MESSAGES[5].popover_title
  );
};

const attachS3RoleToPolicyAndUser = async (
  tutorial: TutorialActions,
  nodes: NodeActions,
  popups: PopupActions
): Promise<void> => {
  await nodes.connectNodes(PolicyNodeID.S3ReadPolicy, RoleNodeID.S3ReadAccessRole);
  await nodes.connectNodes(UserNodeID.FinanceUser, RoleNodeID.S3ReadAccessRole);
  await popups.expectLevelObjectiveCompleteToastAndClose(LEVEL_OBJECTIVES[0][2].id);

  await tutorial.expectPopoverAndClickNext(
    UserNodeID.FinanceUser,
    POPOVER_TUTORIAL_MESSAGES[6].popover_title
  );

  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[2].popover_title);
};

const createServiceRole = async (
  nodes: NodeActions,
  popups: PopupActions,
  name: string,
  solutionKey: 'role1' | 'role2' | 'role3',
  roleId: string,
  policyId: string,
  resourceId: string,
  objectiveId: string
): Promise<void> => {
  await popups.submitCreatePolicyPopup(
    [ElementID.CodeEditorRoleTab],
    ElementID.CodeEditorRoleTab,
    name,
    await getTestSolution(ENCODED_TEST_SOLUTIONS, solutionKey)
  );

  await nodes.expectVisible(roleId);
  await nodes.expectVisible(policyId);

  await nodes.connectNodes(policyId, roleId);
  await nodes.connectNodes(resourceId, roleId);
  await popups.expectLevelObjectiveCompleteToastAndClose(objectiveId);
};

const expectLevelFinalMessages = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[4].title);
};

const completeStage2IntroPopups = async (tutorial: TutorialActions): Promise<void> => {
  await tutorial.expectTutorialPopupAndClickNext(POPUP_TUTORIAL_MESSAGES[3].title);
  await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[3].popover_title);
};

test.describe('Stage 1 - IAM Roles Tutorial Introduction', () => {
  test('Initial Tutorial Flow', async ({ tutorial, nodes, edges, popups, goToLevelAtStage }) => {
    await goToLevelAtStage(5, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete initial popup tutorial (3 sequential popups)', async () => {
      await completeInitialPopupTutorial(tutorial);
    });

    await test.step('Verify initial level setup', async () => {
      await verifyInitialLevelSetup(nodes, edges);
    });

    await test.step('Navigate through role trust policy explanation', async () => {
      await completeTrustPolicyExplanation(tutorial, nodes);
    });

    await test.step('Attach finance user to finance auditor role', async () => {
      await attachFinanceUserToAuditorRole(tutorial, nodes, edges, popups);
    });

    await test.step('Create S3 read access role', async () => {
      await createS3ReadAccessRole(tutorial, nodes, popups);
    });

    await test.step('Attach S3 role to policy and user', async () => {
      await attachS3RoleToPolicyAndUser(tutorial, nodes, popups);
    });
  });

  test('Verify unnecessary edges / nodes warning appears', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(5, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete stage 1 with unnecessary edge', async () => {
      await completeInitialPopupTutorial(tutorial);
      await verifyInitialLevelSetup(nodes, edges);
      await completeTrustPolicyExplanation(tutorial, nodes);

      await nodes.connectNodes(PolicyNodeID.BillingPolicy, UserNodeID.FinanceUser);

      await attachFinanceUserToAuditorRole(tutorial, nodes, edges, popups);
      await createS3ReadAccessRole(tutorial, nodes, popups);
      await attachS3RoleToPolicyAndUser(tutorial, nodes, popups);
    });

    await test.step('Verify unnecessary edges warning appears', async () => {
      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
    });

    await test.step('Remove unnecessary edges and nodes to complete level', async () => {
      await edges.deleteEdge(PolicyNodeID.BillingPolicy, UserNodeID.FinanceUser);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
    });
  });
});

test.describe('Stage 2 - Creating Service Roles in all orders', () => {
  test('Create Lambda first, then EC2', async ({ nodes, popups, tutorial, goToLevelAtStage }) => {
    await goToLevelAtStage(5, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete stage 2 intro popups', async () => {
      await completeStage2IntroPopups(tutorial);
    });

    await test.step('Create Lambda service role', async () => {
      await createServiceRole(
        nodes,
        popups,
        'lambda-service-role',
        'role3',
        RoleNodeID.LambdaRole,
        PolicyNodeID.ChatImagesS3ReadPolicy,
        ResourceNodeID.LambdaFunction,
        LEVEL_OBJECTIVES[1][1].id
      );
    });

    await test.step('Create EC2 service role', async () => {
      await createServiceRole(
        nodes,
        popups,
        'ec2-writer-role',
        'role2',
        RoleNodeID.EC2Role,
        PolicyNodeID.ChatImagesS3WritePolicy,
        ResourceNodeID.TimeshiftLabsEC2Instance,
        LEVEL_OBJECTIVES[1][0].id
      );
    });

    await test.step('Complete level finish messages', async () => {
      await expectLevelFinalMessages(tutorial);
    });
  });

  test('Create EC2 first, then Lambda', async ({ nodes, popups, tutorial, goToLevelAtStage }) => {
    await goToLevelAtStage(5, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete stage 2 intro popups', async () => {
      await completeStage2IntroPopups(tutorial);
    });

    await test.step('Create EC2 service role', async () => {
      await createServiceRole(
        nodes,
        popups,
        'ec2-writer-role',
        'role2',
        RoleNodeID.EC2Role,
        PolicyNodeID.ChatImagesS3WritePolicy,
        ResourceNodeID.TimeshiftLabsEC2Instance,
        LEVEL_OBJECTIVES[1][0].id
      );
    });

    await test.step('Create Lambda service role', async () => {
      await createServiceRole(
        nodes,
        popups,
        'lambda-service-role',
        'role3',
        RoleNodeID.LambdaRole,
        PolicyNodeID.ChatImagesS3ReadPolicy,
        ResourceNodeID.LambdaFunction,
        LEVEL_OBJECTIVES[1][1].id
      );
    });

    await test.step('Complete level finish messages', async () => {
      await expectLevelFinalMessages(tutorial);
    });
  });

  test('Verify unnecessary edges / nodes warning appears', async ({
    tutorial,
    nodes,
    edges,
    popups,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(5, ENCODED_LEVEL_STAGES, 'stage2');

    await test.step('Complete stage 2 with unnecessary edge', async () => {
      await completeStage2IntroPopups(tutorial);

      await createServiceRole(
        nodes,
        popups,
        'ec2-writer-role',
        'role2',
        RoleNodeID.EC2Role,
        PolicyNodeID.ChatImagesS3WritePolicy,
        ResourceNodeID.TimeshiftLabsEC2Instance,
        LEVEL_OBJECTIVES[1][0].id
      );

      await nodes.connectNodes(PolicyNodeID.ChatImagesS3ReadPolicy, RoleNodeID.EC2Role);

      await createServiceRole(
        nodes,
        popups,
        'lambda-service-role',
        'role3',
        RoleNodeID.LambdaRole,
        PolicyNodeID.ChatImagesS3ReadPolicy,
        ResourceNodeID.LambdaFunction,
        LEVEL_OBJECTIVES[1][1].id
      );

      await tutorial.expectFixedPopoverAndClickNext(FIXED_POPOVER_MESSAGES[4].popover_title);
    });

    await test.step('Verify unnecessary edges warning appears', async () => {
      await tutorial.expectUnnecessaryEdgesNodesWarning(true);
    });

    await test.step('Remove unnecessary edges and nodes to complete level', async () => {
      await edges.deleteEdge(PolicyNodeID.ChatImagesS3ReadPolicy, RoleNodeID.EC2Role);
      await tutorial.expectUnnecessaryEdgesNodesWarning(false);
    });
  });
});

test.describe('Complete Level - End to End', () => {
  test('Complete entire level flow from start to finish', async ({
    tutorial,
    nodes,
    popups,
    edges,
    goToLevelAtStage,
  }) => {
    await goToLevelAtStage(5, ENCODED_LEVEL_STAGES, 'stage1');

    await test.step('Complete Stage 1 - Tutorial introduction and role basics', async () => {
      await completeInitialPopupTutorial(tutorial);
      await verifyInitialLevelSetup(nodes, edges);
      await completeTrustPolicyExplanation(tutorial, nodes);
      await attachFinanceUserToAuditorRole(tutorial, nodes, edges, popups);
      await createS3ReadAccessRole(tutorial, nodes, popups);
      await attachS3RoleToPolicyAndUser(tutorial, nodes, popups);
    });

    await test.step('Complete Stage 2 - Create service roles', async () => {
      await completeStage2IntroPopups(tutorial);

      await createServiceRole(
        nodes,
        popups,
        'lambda-service-role',
        'role3',
        RoleNodeID.LambdaRole,
        PolicyNodeID.ChatImagesS3ReadPolicy,
        ResourceNodeID.LambdaFunction,
        LEVEL_OBJECTIVES[1][1].id
      );

      await createServiceRole(
        nodes,
        popups,
        'ec2-writer-role',
        'role2',
        RoleNodeID.EC2Role,
        PolicyNodeID.ChatImagesS3WritePolicy,
        ResourceNodeID.TimeshiftLabsEC2Instance,
        LEVEL_OBJECTIVES[1][0].id
      );

      await expectLevelFinalMessages(tutorial);
    });
  });
});
