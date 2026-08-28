import { SLACK_INTEGRATION_SECRET_ARN } from './constants';
import { generateSlackManageServiceSchema } from './schemas/slack-manage-service-policy';
import { IAMNodeFilter } from '../utils/filters/iam-node-filter';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';
import { IAMAnyNode } from '@/types/iam-node-types';

export const ObjectivesApplicableNodesFns = {
  seniorUsersApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create().fromNodes(nodes).whereHasTag('role', 'senior').build(),
};

export const ValidateFunctions = {
  slackManagePolicyValidateFn1: () =>
    AJV_COMPILER.compile(
      generateSlackManageServiceSchema(SLACK_INTEGRATION_SECRET_ARN, { withTags: false })
    ),
  slackManagePolicyValidateFn2: () =>
    AJV_COMPILER.compile(
      generateSlackManageServiceSchema(SLACK_INTEGRATION_SECRET_ARN, { withTags: true })
    ),
};

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
