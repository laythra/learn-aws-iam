export enum HandleID {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export enum AccessLevel {
  Read = 'Read',
  Write = 'Write',
  ReadWrite = 'Read/Write',
  Delete = 'Delete',
  Full = 'Full',
  StartStopControl = 'Control (Start/Stop)',
}

export enum IAMNodeEntity {
  User = 'IAM User',
  AggregatedUsers = 'Aggregated IAM Users',
  Group = 'IAM Group',
  Role = 'IAM Role',
  IdentityPolicy = 'Identity Policy',
  Resource = 'AWS Resource',
  Account = 'Account',
  OU = 'Organizational Unit',
  SCP = 'Service Control Policy',
  ResourcePolicy = 'Resource Policy',
  PermissionBoundary = 'Permission Boundary',
}

export type IAMCodeDefinedEntity =
  | IAMNodeEntity.IdentityPolicy
  | IAMNodeEntity.Role
  | IAMNodeEntity.SCP
  | IAMNodeEntity.ResourcePolicy
  | IAMNodeEntity.PermissionBoundary;

export enum IAMNodeResourceEntity {
  Resource = 'AWS Resource',
  S3Bucket = 'S3 Bucket',
  DynamoDBTable = 'DynamoDB Table',
  EC2Instance = 'EC2 Instance',
  CloudFront = 'CloudFront CDN',
  Billing = 'Billing and Cost Management',
  Lambda = 'Lambda Function',
  Secret = 'Secret',
  RDS = 'RDS',
  CloudTrail = 'CloudTrail',
  ElastiCache = 'ElastiCache',
  CodeDeploy = 'CodeDeploy',
}

export enum IAMNodeImage {
  User = 'user',
  S3Bucket = 'bucket',
  Policy = 'policy',
  Group = 'group',
  Database = 'database',
  Server = 'server',
  CDN = 'cdn',
  Role = 'role',
  Billing = 'billing',
  Lambda = 'lambda',
  OU = 'ou',
  Secret = 'secret',
  SCP = 'scp',
  CloudTrail = 'cloudtrail',
  ElastiCache = 'elasticache',
  CodeDeploy = 'codedeploy',
}

export type CreatableIAMNodeEntity =
  | IAMNodeEntity.User
  | IAMNodeEntity.Group
  | IAMNodeEntity.IdentityPolicy
  | IAMNodeEntity.Role
  | IAMNodeEntity.PermissionBoundary;

/**
 * Defines common layout group IDs for node placement within the canvas.
 * These IDs represent logical groupings of nodes based on their intended position
 * and layout direction within the canvas. check `nodes-position.ts` for more details.
 */
export enum CommonLayoutGroupID {
  CenterHorizontal = 'center-horizontal',
  CenterVertical = 'center-vertical',
  TopCenterHorizontal = 'top-center-horizontal',
  TopCenterVertical = 'top-center-vertical',
  TopLeftHorizontal = 'top-left-horizontal',
  TopLeftVertical = 'top-left-vertical',
  TopRightHorizontal = 'top-right-horizontal',
  TopRightVertical = 'top-right-vertical',
  BottomCenterHorizontal = 'bottom-center-horizontal',
  BottomCenterVertical = 'bottom-center-vertical',
  BottomLeftHorizontal = 'bottom-left-horizontal',
  BottomLeftVertical = 'bottom-left-vertical',
  BottomRightHorizontal = 'bottom-right-horizontal',
  BottomRightVertical = 'bottom-right-vertical',
  LeftCenterHorizontal = 'left-center-horizontal',
  LeftCenterVertical = 'left-center-vertical',
  RightCenterHorizontal = 'right-center-horizontal',
  RightCenterVertical = 'right-center-vertical',
}
