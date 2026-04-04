export const INITIAL_POLICIES = {
  S3_READ_RESOURCE_BASED_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:GetObject'],
        Resource: 'INSERT BUCKET ARN HERE',
        Principal: 'INSERT PRINCIPAL OBJECT HERE',
      },
    ],
  },
};
