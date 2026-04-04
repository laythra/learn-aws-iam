export const INTERNS_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Deny',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::timeshift-*',
      },
      {
        Effect: 'Allow',
        Action: ['s3:GetObject'],
        Resource: 'arn:aws:s3:::timeshift-assets/*',
      },
    ],
  },
  null,
  2
);
