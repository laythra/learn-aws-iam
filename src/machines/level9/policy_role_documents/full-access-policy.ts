export const FULL_ACCESSS_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Action: '*', Resource: '*' }],
  },
  null,
  2
);
