export const INITIAL_POLICIES = {
  CODEDEPLOY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'codedeploy:RegisterApplicationRevision',
          'codedeploy:ListApplicationRevisions',
          'codedeploy:GetApplication',
        ],
        Resource: [
          'arn:aws:codedeploy:us-east-1:123456789012:',
          'deploymentgroup:slack-alerting-app/staging-group',
        ].join(''),
      },
      {
        Effect: 'Allow',
        Action: [
          'codedeploy:CreateDeployment',
          'codedeploy:GetDeployment',
          'codedeploy:ListDeployments',
          'codedeploy:GetDeploymentGroup',
          'codedeploy:GetDeploymentConfig',
        ],
        Resource: [
          'arn:aws:codedeploy:us-east-1:123456789012:',
          'deploymentgroup:slack-alerting-app/staging-group',
        ].join(''),
      },
      {
        Effect: 'Allow',
        Action: 'codedeploy:GetDeploymentConfig',
        Resource:
          'arn:aws:codedeploy:us-east-1:123456789012:deploymentconfig:CodeDeployDefault.AllAtOnce',
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
