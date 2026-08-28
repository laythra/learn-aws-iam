import { ALPHA_TEAM_SECRET_ARN, BETA_TEAM_SECRET_ARN } from './constants';

export const INITIAL_POLICIES = {
  ALPHA_TEAM_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'INSERT_ACTION_HERE',
        Resource: ALPHA_TEAM_SECRET_ARN,
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: 'rds-data:ExecuteStatement',
        Resource: 'arn:aws:rds:us-east-1:123456789012:cluster:alpha-team-db',
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
        Resource: BETA_TEAM_SECRET_ARN,
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: 'rds-data:ExecuteStatement',
        Resource: 'arn:aws:rds:us-east-1:123456789012:cluster:beta-team-db',
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
        Action: 'rds-data:ExecuteStatement',
        Resource: 'arn:aws:rds:us-east-1:123456789012:cluster:*',
        Condition: {},
      },
    ],
  },
};
