export const INITIAL_POLICIES = {
  PEACH_TEAM_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'INSERT_ACTION_HERE',
        Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:db/peach-team',
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: 'rds-db:connect',
        Resource: 'arn:aws:rds-db:us-east-1:123456789012:dbuser:db-PEACHDB123/app_user',
        Condition: {},
      },
    ],
  },
  BOWSER_FORCE_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'INSERT_ACTION_HERE',
        Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:db/bowser-force',
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: 'rds-db:connect',
        Resource: 'arn:aws:rds-db:us-east-1:123456789012:dbuser:db-BOWSERDB123/app_user',
        Condition: {},
      },
    ],
  },
  SHARED_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'secretsmanager:GetSecretValue',
        Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:db/*',
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: 'rds-db:connect',
        Resource: 'arn:aws:rds-db:us-east-1:123456789012:dbuser:*/*',
        Condition: {},
      },
    ],
  },
};
