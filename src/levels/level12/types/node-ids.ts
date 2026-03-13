export const AccountID = {
  TutorialStagingAccount: '12345678901',
  TutorialProdAccount: '98765432109',
  InLevelStagingAccount: '12345678901',
  InLevelProdAccount: '98765432109',
} as const;

export const GroupNodeID = {
  TutorialEldianGroup: 'tutorial-group-1',
  TutorialMarleyGroup: 'tutorial-group-2',
  InLevelSearchTeamGroup: 'in-level-group-1',
  InLevelNotificationsTeamGroup: 'in-level-group-2',
  InLevelPaymentsTeamGroup: 'in-level-group-3',
} as const;

export const OUNodeID = {
  TutorialOU: 'tutorial-ou-1',
  InLevelOU: 'in-level-ou-1',
} as const;

export const UserNodeID = {
  Eren: 'user-eren',
  Mikasa: 'user-mikasa',
  Armin: 'user-armin',
  Reiner: 'user-reiner',
  Bertolt: 'user-bertolt',
  Annie: 'user-annie',
  Laith: 'user-laith',
  Mohammad: 'user-mohammad',
  Ayman: 'user-ayman',
  Firas: 'user-firas',
  Yasmin: 'user-yasmin',
  Tareq: 'user-tareq',
  Rania: 'user-rania',
  Karim: 'user-karim',
  Salma: 'user-salma',
  Omar: 'user-omar',
} as const;

export const SCPNodeID = {
  DefaultSCP: 'scp-default',
  BlockCloudTrailDeletionSCP: 'scp-block-cloudtrail-deletion',
  RestrictEC2RegionSCP: 'scp-restrict-ec2-region',
} as const;

export const PermissionBoundaryID = {
  Ec2LaunchPermissionBoundary: 'PB-EC2-Launch',
} as const;

export const ResourceNodeID = {
  TutorialCloudTrailStaging: 'resource-cloudtrail-staging-1',
  TutorialCloudTrailProd: 'resource-cloudtrail-prod-1',
  InLevelProductionS3Bucket: 'resource-production-s3-bucket-1',
  InLevelStagingS3Bucket: 'resource-staging-s3-bucket-1',
  InLevelProductionElastiCacheCluster1: 'resource-production-elasticache-cluster-1',
  InLevelProductionElastiCacheCluster2: 'resource-production-elasticache-cluster-2',
  InLevelProductionElastiCacheCluster3: 'resource-production-elasticache-cluster-3',
  InLevelStagingEC2Instance: 'resource-staging-ec2-instance-1',
} as const;

export const PolicyNodeID = {
  TutorialStagingCloudTrailAccess: 'policy-tutorial-staging-cloudtrail-access',
  TutorialProdCloudTrailAccess: 'policy-prod-cloudtrail-access',
  S3WriteAccessPolicy: 'policy-s3-write-access',
  ElasticCacheManagementPolicy: 'policy-elasticache-management',
  RunEc2InstancesPolicy: 'policy-run-ec2-instances',
  AccessDelegationPolicy: 'policy-access-delegation',
} as const;

export const RoleNodeID = {
  EC2LaunchRole: 'role-ec2-launch',
  S3WriteAccessRole: 'role-s3-write-access',
} as const;
