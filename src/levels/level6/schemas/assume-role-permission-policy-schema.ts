export function generateAssumeRolePermissionPolicySchema(roleArn: string): object {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['Version', 'Statement'],
    properties: {
      Version: { type: 'string', const: '2012-10-17' },
      Statement: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['Effect', 'Action', 'Resource'],
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
            Resource: { type: 'string', const: roleArn },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  } as const;
}
