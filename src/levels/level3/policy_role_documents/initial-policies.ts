export const INITIAL_POLICIES = {
  S3ReadAccess: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:GetObject'],
        Resource: 'INSERT BUCKET ARN HERE',
      },
    ],
  },
  AmazonS3ReadOnlyAccess: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:Get*', 's3:List*'],
        Resource: '*',
      },
    ],
  },
};
