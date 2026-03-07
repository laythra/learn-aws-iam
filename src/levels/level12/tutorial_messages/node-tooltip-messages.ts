export const EC2_ROLE_ALERT_MESSAGE =
  "This role requirs S3 write access. Don't forget to attach the policy to the role! ";

export const S3_WRITE_POLICY_ALERT_MESSAGE =
  'Attach this policy (somewhere) to grant S3 write permissions to the EC2 instance.';

export const ELASTICACHE_MANAGEMENT_POLICY_ALERT_MESSAGE =
  'Connect this policy to groups to grant ElastiCache management permissions.';

export const SCP_ALERT_MESSAGE = 'Connect the SCP to the appropriate OU/Account node(s)';

export const PERMISSION_BOUNDARY_ALERT_MESSAGE = 'Attach this somewhere to cap permissions';
