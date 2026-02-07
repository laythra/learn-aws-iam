export const DEVELOPERS_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'dynamodb:*',
        Resource: 'arn:aws:dynamodb:us-east-1:123456789012:table/customer-data',
      },
      {
        Effect: 'Allow',
        Action: ['s3:GetObject', 's3:PutObject'],
        Resource: 'arn:aws:s3:::timeshift-assets',
      },
    ],
  },
  null,
  2
);
