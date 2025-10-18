import slackServicePolicyNoTags from './schemas/policy/slack-manage-service-policy-no-tags.json';
import { PolicyNodeID } from './types/node-id-enums';
import { IAMNodeFilter } from '../utils/iam-node-filter';
import { IAMAnyNode } from '@/types/iam-node-types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ObjectivesApplicableNodesFns = {
  seniorUsersApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create().fromNodes(nodes).whereHasTag('role', 'senior').build(),
} as const;

export const ValidateFunctions = {
  [PolicyNodeID.SlackServiceManagePolicy]: () => AJV_COMPILER.compile(slackServicePolicyNoTags),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
