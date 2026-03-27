export const INITIAL_POLICIES = {
  INITIAL_ROLE: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'codedeploy:RegisterApplicationRevision',
          'codedeploy:ListApplicationRevisions',
          'codedeploy:GetApplication',
        ],
        Resource: 'arn:aws:codedeploy:us-east-1:123456789012:application:slack-alerting-app',
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
        Resource:
          'arn:aws:codedeploy:us-east-1:123456789012:deploymentgroup:slack-alerting-app/staging-group',
      },
      {
        Effect: 'Allow',
        Action: 'codedeploy:GetDeploymentConfig',
        Resource:
          'arn:aws:codedeploy:us-east-1:123456789012:deploymentconfig:CodeDeployDefault.AllAtOnce',
      },
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:slack-integration-secret',
      },
    ],
  },
};
