import slackServicePolicyNoTags from './schemas/slack-manage-service-policy-no-tags.json';
import slackServicePolicyWithTags from './schemas/slack-manage-service-policy-with-tags.json';
import { IAMNodeFilter } from '../utils/filters/iam-node-filter';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';
import { IAMAnyNode } from '@/types/iam-node-types';

export const ObjectivesApplicableNodesFns = {
  seniorUsersApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create().fromNodes(nodes).whereHasTag('role', 'senior').build(),
};

export const ValidateFunctions = {
  slackManagePolicyValidateFn1: () => AJV_COMPILER.compile(slackServicePolicyNoTags),
  slackManagePolicyValidateFn2: () => AJV_COMPILER.compile(slackServicePolicyWithTags),
};

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
