export const INITIAL_POLICIES = {
  S3_READ_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:Get*', 's3:List*', 's3:Describe*'],
        Resource: '*',
      },
    ],
  },
  DYNAMO_DB_READ_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:GetItem',
          'dynamodb:BatchGetItem',
          'dynamodb:Scan',
          'dynamodb:Query',
          'dynamodb:DescribeTable',
          'dynamodb:ListTables',
        ],
        Resource: '*',
      },
    ],
  },
  EC2_READ_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'ec2:Describe*',
        Resource: '*',
      },
    ],
  },
};
