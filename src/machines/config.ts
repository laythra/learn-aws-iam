export const MANAGED_POLICIES = {
  AWSS3ReadOnlyAccess: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:Get*', 's3:List*'],
        Resource: '*',
      },
    ],
  },
  EmptyPolicy: {
    Version: '2012-10-17',
    Statement: [],
  },
  EmptyTrustPolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '...',
        Action: 'sts:AssumeRole',
      },
    ],
  },
  EmptyPermissionPolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [],
        Resource: [],
      },
    ],
  },
};

export const TUTORIAL_FINISHED_POPUP_MESSAGE = `
  Congratulations! You have successfully completed the IAM tutorial Demo.
  You have learned about IAM policies, roles, and groups,
  and how to manage access to AWS resources effectively.

  There's more stuff coming up soon, we'll tackle more advanced topics like:
  - Permission Boundaries
  - Service Control Policies
  - Federated Access
  and much more!

  In the meantime, you can check out the following resources to deepen your understanding of IAM:
  - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
  - [AWS IAM Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html)

  Click on the button below to start from the beginning and explore the IAM tutorial again.
`;
