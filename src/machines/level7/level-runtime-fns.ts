import s3ReadPolicySchema from './schemas/policy/s3-read-policy-schema.json';
import s3ReadWriteIdentityPolicySchema from './schemas/policy/s3-read-write-identity-policy-schema.json';
import s3ReadWriteResourcePolicySchema from './schemas/policy/s3-read-write-resource-policy-schema.json';
import { PolicyNodeID, ResourcePolicyNodeID } from './types/node-id-enums';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ValidateFunctions = {
  [PolicyNodeID.InsideLevelIdentityBasedPolicy]: () =>
    AJV_COMPILER.compile(s3ReadWriteIdentityPolicySchema),
  [ResourcePolicyNodeID.TutorialResourceBasedPolicy]: () =>
    AJV_COMPILER.compile(s3ReadPolicySchema),
  [ResourcePolicyNodeID.InsideLevelResourceBasedPolicy]: () =>
    AJV_COMPILER.compile(s3ReadWriteResourcePolicySchema),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
