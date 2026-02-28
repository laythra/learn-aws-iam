export function generateRdsManagePolicySchema(teamName: string, resourceId: string): object {
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
        minItems: 2,
        maxItems: 2,
        items: {
          oneOf: [
            {
              $ref: '#/definitions/connectStatement',
            },
            {
              $ref: '#/definitions/secretStatement',
            },
          ],
        },
        allOf: [
          {
            contains: {
              $ref: '#/definitions/connectStatement',
            },
          },
          {
            contains: {
              $ref: '#/definitions/secretStatement',
            },
          },
        ],
      },
    },
    definitions: {
      principalCondition: {
        type: 'object',
        required: ['StringEquals'],
        properties: {
          StringEquals: {
            type: 'object',
            required: ['aws:PrincipalTag/application'],
            properties: {
              'aws:PrincipalTag/application': {
                const: teamName,
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
      connectStatement: {
        type: 'object',
        required: ['Effect', 'Action', 'Resource', 'Condition'],
        properties: {
          Effect: {
            const: 'Allow',
          },
          Action: {
            oneOf: [
              {
                const: 'rds-db:connect',
              },
              {
                type: 'array',
                items: {
                  const: 'rds-db:connect',
                },
                minItems: 1,
                maxItems: 1,
                uniqueItems: true,
              },
            ],
          },
          Resource: {
            const: `arn:aws:rds-db:us-east-1:123456789012:dbuser:db-${resourceId}/app_user`,
          },
          Condition: {
            $ref: '#/definitions/principalCondition',
          },
        },
        additionalProperties: false,
      },
      secretStatement: {
        type: 'object',
        required: ['Effect', 'Action', 'Resource', 'Condition'],
        properties: {
          Effect: {
            const: 'Allow',
          },
          Action: {
            oneOf: [
              {
                const: 'secretsmanager:GetSecretValue',
              },
              {
                type: 'array',
                items: {
                  const: 'secretsmanager:GetSecretValue',
                },
                minItems: 1,
                maxItems: 1,
                uniqueItems: true,
              },
            ],
          },
          Resource: {
            const: `arn:aws:secretsmanager:us-east-1:123456789012:secret:db/${teamName}`,
          },
          Condition: {
            $ref: '#/definitions/principalCondition',
          },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  };
}
