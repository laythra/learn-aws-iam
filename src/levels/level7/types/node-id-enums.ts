export const AccountID = {
  TrustingAccount: '123456789012',
  TrustedAccount: '987654321098',
} as const;

export const UserNodeID = {
  TutorialFirstUser: 'user-1',
  InsideLevelUser: 'user-2',
} as const;

export const ResourcePolicyNodeID = {
  TutorialResourceBasedPolicy: 'resource-policy-1',
  InsideLevelResourceBasedPolicy: 'resource-policy-2',
} as const;

export const PolicyNodeID = {
  InsideLevelIdentityBasedPolicy: 'policy-1',
} as const;

export const ResourceNodeID = {
  TutorialS3Bucket: 'resource-1',
  InsideLevelS3Bucket: 'resource-2',
} as const;
