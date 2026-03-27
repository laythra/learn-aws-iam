export const INITIAL_POLICIES = {
  ALPHA_TEAM_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'INSERT_ACTION_HERE',
        Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:db/alpha-team-AbCdEf',
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: 'rds-db:connect',
        Resource: 'arn:aws:rds-db:us-east-1:123456789012:dbuser:db-ALPHADB123/app_user',
        Condition: {},
      },
    ],
  },
  BETA_TEAM_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'INSERT_ACTION_HERE',
        Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:db/beta-team-GhIjKl',
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: 'rds-db:connect',
        Resource: 'arn:aws:rds-db:us-east-1:123456789012:dbuser:db-BETADB123/app_user',
        Condition: {},
      },
    ],
  },
  SHARED_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
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
