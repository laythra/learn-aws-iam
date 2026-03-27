export function generateAssumeRolePolicySchema(additionalRoleArn: string): object {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['Version', 'Statement'],
    additionalProperties: false,
    properties: {
      Version: { type: 'string', const: '2012-10-17' },
      Statement: {
        type: 'array',
        minItems: 1,
        maxItems: 1,
        items: {
          type: 'object',
          required: ['Effect', 'Action', 'Resource'],
          additionalProperties: false,
          properties: {
            Effect: { type: 'string', const: 'Allow' },
            Action: {
              oneOf: [
                { type: 'string', const: 'sts:AssumeRole' },
                {
                  type: 'array',
                  items: { type: 'string', const: 'sts:AssumeRole' },
                  minItems: 1,
                  maxItems: 1,
                  uniqueItems: true,
                },
              ],
            },
            Resource: {
              type: 'array',
              minItems: 2,
              maxItems: 2,
              uniqueItems: true,
              items: { type: 'string' },
              allOf: [
                {
                  contains: {
                    type: 'string',
                    const: 'arn:aws:iam::123456789012:role/FinanceAuditorRole',
                  },
                },
                { contains: { type: 'string', const: additionalRoleArn } },
              ],
            },
          },
        },
      },
    },
  } as const;
}
