export const AccountID = {
  TutorialStagingAccount: 'staging-account-1',
  TutorialProdAccount: 'prod-account-1',
};

export const GroupNodeID = {
  TutorialEldianGroup: 'tutorial-group-1',
  TutorialMarleyGroup: 'tutorial-group-2',
};

export const OUNodeID = {
  TutorialOU: 'tutorial-ou-1',
  InLevelOU: 'in-level-ou-1',
};

export const UserNodeID = {
  Eren: 'user-eren',
  Mikasa: 'user-mikasa',
  Armin: 'user-armin',
  Reiner: 'user-reiner',
  Bertolt: 'user-bertolt',
  Annie: 'user-annie',
} as const;

export const SCPNodeID = {
  DefaultSCP: 'scp-default',
  BlockCloudTrailDeletionSCP: 'scp-block-cloudtrail-deletion',
} as const;

export const PermissionBoundaryID = {
  PermissionBoundary1: 'PB1',
  SecretsReadingPermissionBoundary: 'PB2',
} as const;

export const ResourceNodeID = {
  TutorialCloudTrailStaging: 'resource-cloudtrail-staging-1',
  TutorialCloudTrailProd: 'resource-cloudtrail-prod-1',
};

export const PolicyNodeID = {
  TutorialStagingCloudTrailAccess: 'policy-tutorial-staging-cloudtrail-access',
  TutorialProdCloudTrailAccess: 'policy-prod-cloudtrail-access',
} as const;

export const RoleNodeID = {
  Role1: 'role-1',
} as const;
