import { generateAssumeRolePolicySchema } from './schemas/policy/delegating-permissions-policy';
import ec2RoleTrustPolicy from './schemas/policy/ec2-role-trust-policy.json';
import s3UploadPolicySchema from './schemas/policy/ec2-staging-s3-upload-policy.json';
import elasticacheManagementPolicySchema from './schemas/policy/elasticcache-prod-management-policy.json';
import launchEc2InstancePolicySchema from './schemas/policy/launch-ec2-instances-policy.json';
import restrictEc2RegionSCP from './schemas/policy/restrict-ec2-region-scp.json';
import trailsDeletionSCP from './schemas/policy/trails-deletion-scp.json';
import {
  AccountID,
  PermissionBoundaryID,
  PolicyNodeID,
  RoleNodeID,
  SCPNodeID,
} from './types/node-id-enums';
import { IAMNodeFilter } from '../utils/iam-node-filter';
import { IAMNodeEntity, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';
import { generateArn } from '@/lib/iam/arn-generator';
import { AJV_COMPILER } from '@/lib/iam/iam-code-linter';

export const ValidateFunctions = {
  [PolicyNodeID.AccessDelegationPolicy]: (nodes: IAMAnyNode[]) => {
    const pbNode = nodes.find(
      node => node.data.id === PermissionBoundaryID.Ec2LaunchPermissionBoundary
    )!;

    const pbArn = generateArn(
      IAMNodeEntity.PermissionBoundary,
      pbNode.data.label,
      AccountID.InLevelStagingAccount
    );
    return AJV_COMPILER.compile(generateAssumeRolePolicySchema(pbArn));
  },
  [PermissionBoundaryID.Ec2LaunchPermissionBoundary]: () =>
    AJV_COMPILER.compile(launchEc2InstancePolicySchema),
  [PolicyNodeID.ElasticCacheManagementPolicy]: () =>
    AJV_COMPILER.compile(elasticacheManagementPolicySchema),
  [RoleNodeID.S3WriteAccessRole]: () => AJV_COMPILER.compile(ec2RoleTrustPolicy),
  [PolicyNodeID.S3WriteAccessPolicy]: () => AJV_COMPILER.compile(s3UploadPolicySchema),
  [SCPNodeID.BlockCloudTrailDeletionSCP]: () => AJV_COMPILER.compile(trailsDeletionSCP),
  [SCPNodeID.RestrictEC2RegionSCP]: () => AJV_COMPILER.compile(restrictEc2RegionSCP),
} as const;

export const ObjectivesApplicableNodesFns = {
  notificationsSquadApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('squad', 'notifications')
      .build(),
  searchSquadApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('squad', 'search')
      .build(),
  paymentsSquadApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('squad', 'payments')
      .build(),
} as const;

export const GuardRailsBlockedEdgesFunctions = {
  SCP1BlockingFN: (edge: IAMEdge) => {
    return (
      edge.data?.target_node.data.entity === IAMNodeEntity.Resource &&
      edge.data?.target_node.data.resource_type === IAMNodeResourceEntity.CloudTrail
    );
  },
  SCP2BlockingFN: (edge: IAMEdge) => {
    return (
      edge.data?.target_node.data.entity === IAMNodeEntity.Resource &&
      edge.data?.target_node.data.resource_type === IAMNodeResourceEntity.CloudTrail
    );
  },
  PB1BlockingFN: (_edge: IAMEdge) => {
    return false; // No edges are blocked by this PB
  },
};

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
export type GuardRailsBlockedEdgesFnName = keyof typeof GuardRailsBlockedEdgesFunctions;
