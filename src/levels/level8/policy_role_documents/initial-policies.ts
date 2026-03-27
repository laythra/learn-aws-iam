export const INITIAL_POLICIES = {
  CODEDEPLOY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'codedeploy:RegisterApplicationRevision',
          'codedeploy:CreateDeployment',
          'codedeploy:GetDeployment',
          'codedeploy:ListDeployments',
        ],
        Resource: 'arn:aws:codedeploy:us-east-1:123456789012:application:SlackCodeDeployApp',
      },
    ],
  },
  SECRETS_ACCESS: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:slack-integration-secret',
      },
    ],
  },
};
