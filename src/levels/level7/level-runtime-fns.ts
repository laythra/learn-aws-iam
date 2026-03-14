import s3ReadPolicySchema from './schemas/s3-read-policy-schema.json';
import s3ReadWriteIdentityPolicySchema from './schemas/s3-read-write-identity-policy-schema.json';
import s3ReadWriteResourcePolicySchema from './schemas/s3-read-write-resource-policy-schema.json';
import { PolicyNodeID, ResourcePolicyNodeID } from './types/node-ids';
import { IAMNodeFilter } from '../utils/filters/iam-node-filter';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

export const ObjectivesApplicableNodesFns = {
  publicImagesApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('team', 'payments-team')
      .build(),
} as const;

export const ValidateFunctions = {
  [ResourcePolicyNodeID.TutorialResourceBasedPolicy]: () =>
    AJV_COMPILER.compile(s3ReadPolicySchema),
  [ResourcePolicyNodeID.InsideLevelResourceBasedPolicy]: () =>
    AJV_COMPILER.compile(s3ReadWriteResourcePolicySchema),
  [PolicyNodeID.InsideLevelIdentityBasedPolicy]: () =>
    AJV_COMPILER.compile(s3ReadWriteIdentityPolicySchema),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
