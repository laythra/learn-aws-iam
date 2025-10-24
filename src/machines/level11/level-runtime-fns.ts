import { generateAssumeRolePolicySchema } from './schemas/policy/delegating-permissions-policy';
import readSecretsPermissionBoundarySchema from './schemas/policy/read-secrets-permission-boundary.json';
import {
  PermissionBoundaryID,
  PolicyNodeID,
  ResourceNodeID,
  UserNodeID,
} from './types/node-id-enums';
import { IAMAnyNode, IAMNodeEntity } from '@/types';
import { generateArn } from '@/utils/arn-generator';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ValidateFunctions = {
  [PolicyNodeID.AccessDelegationPolicy]: (nodes: IAMAnyNode[]) => {
    const pbNode = nodes.find(
      node => node.data.id === PermissionBoundaryID.SecretsReadingPermissionBoundary
    )!;

    const pbArn = generateArn(IAMNodeEntity.PermissionBoundary, pbNode.data.label);
    return AJV_COMPILER.compile(generateAssumeRolePolicySchema(pbArn));
  },
  [PermissionBoundaryID.SecretsReadingPermissionBoundary]: () =>
    AJV_COMPILER.compile(readSecretsPermissionBoundarySchema),
} as const;

export const GuardRailsBlockedEdgesFunctions = {
  permissionBoundary1BlockingFn: (edge: { source: string; target: string }) => {
    debugger;
    return edge.source === UserNodeID.Sephiroth && edge.target === ResourceNodeID.S3BucketTutorial;
  },
  permissionBoundary2BlockingFn: (edge: { source: string; target: string }) => {
    return [ResourceNodeID.Secret1, ResourceNodeID.Secret2].includes(edge.target);
  },
};

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
export type GuardRailsBlockedEdgesFnName = keyof typeof GuardRailsBlockedEdgesFunctions;
