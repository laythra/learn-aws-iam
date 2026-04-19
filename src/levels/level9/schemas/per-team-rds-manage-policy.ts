export function generateRdsManagePolicySchema(teamName: string, secretSuffix: string): object {
  const secretArn = `
    arn:aws:secretsmanager:us-east-1:123456789012:secret:db/${teamName}-${secretSuffix}
  `.trim();

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
        items: [
          { $ref: '#/definitions/secretStatement' },
          { $ref: '#/definitions/connectStatement' },
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
                const: 'rds-data:ExecuteStatement',
              },
              {
                type: 'array',
                items: {
                  const: 'rds-data:ExecuteStatement',
                },
                minItems: 1,
                maxItems: 1,
                uniqueItems: true,
              },
            ],
          },
          Resource: {
            const: `arn:aws:rds:us-east-1:123456789012:cluster:${teamName}-db`,
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
            type: 'array',
            items: {
              type: 'string',
              enum: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            },
            minItems: 2,
            maxItems: 2,
            uniqueItems: true,
          },
          Resource: {
            const: secretArn,
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
