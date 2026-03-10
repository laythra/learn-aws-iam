export function generateDelegatePermissionsPolicySchema(permissionBoundaryArn: string): object {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['Version', 'Statement'],
    properties: {
      Version: {
        const: '2012-10-17',
      },
      Statement: {
        type: 'array',
        minItems: 1,
        maxItems: 1,
        items: {
          type: 'object',
          required: ['Effect', 'Action', 'Resource', 'Condition'],
          properties: {
            Effect: {
              const: 'Allow',
            },
            Action: {
              type: 'array',
              minItems: 2,
              maxItems: 2,
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['iam:AttachRolePolicy', 'iam:DetachRolePolicy'],
              },
            },
            Resource: {
              oneOf: [
                { const: '*' },
                {
                  type: 'array',
                  items: { const: '*' },
                  minItems: 1,
                  maxItems: 1,
                  uniqueItems: true,
                },
              ],
            },
            Condition: {
              type: 'object',
              required: ['StringEquals'],
              properties: {
                StringEquals: {
                  type: 'object',
                  required: ['iam:PermissionsBoundary'],
                  properties: {
                    'iam:PermissionsBoundary': {
                      const: permissionBoundaryArn,
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  };
}
