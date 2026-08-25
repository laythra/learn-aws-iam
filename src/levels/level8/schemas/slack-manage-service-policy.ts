interface SlackManageServiceSchemaOptions {
  withTags: boolean;
}

// "No tags" objective: access is scoped to two specific senior users named by ARN, accepted
// through either StringEquals or ArnEquals on aws:PrincipalArn.
const principalArnValueDefinition = {
  type: 'object',
  required: ['aws:PrincipalArn'],
  properties: {
    'aws:PrincipalArn': {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      uniqueItems: true,
      items: {
        enum: [
          'arn:aws:iam::123456789012:user/senior-sam',
          'arn:aws:iam::123456789012:user/senior-jordan',
        ],
      },
    },
  },
  additionalProperties: false,
};

const noTagsCondition = {
  type: 'object',
  oneOf: [
    {
      required: ['StringEquals'],
      properties: { StringEquals: { $ref: '#/definitions/principalArnValue' } },
      additionalProperties: false,
    },
    {
      required: ['ArnEquals'],
      properties: { ArnEquals: { $ref: '#/definitions/principalArnValue' } },
      additionalProperties: false,
    },
  ],
};

// "With tags" objective: access is scoped by the caller's role tag instead of explicit ARNs.
const withTagsCondition = {
  type: 'object',
  required: ['StringEquals'],
  properties: {
    StringEquals: {
      type: 'object',
      required: ['aws:PrincipalTag/role'],
      properties: { 'aws:PrincipalTag/role': { const: 'senior' } },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

// Builds the level 8 answer-key schema with the Secret's ARN injected from the caller, so the
// expected ARN always tracks the single source of truth (SLACK_INTEGRATION_SECRET_ARN) rather
// than a hardcoded suffix that could drift from the generator (issue #364's bug class).
export function generateSlackManageServiceSchema(
  secretArn: string,
  { withTags }: SlackManageServiceSchemaOptions
): object {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['Version', 'Statement'],
    properties: {
      Version: {
        type: 'string',
        enum: ['2012-10-17'],
      },
      Statement: {
        type: 'array',
        minItems: 1,
        maxItems: 1,
        items: { $ref: '#/definitions/secretsManagerStatement' },
      },
    },
    definitions: {
      ...(withTags ? {} : { principalArnValue: principalArnValueDefinition }),
      secretsManagerStatement: {
        type: 'object',
        required: ['Effect', 'Action', 'Resource', 'Condition'],
        properties: {
          Sid: { $ref: 'aws-iam-shared-definitions-schema.json#/definitions/Sid' },
          Effect: { const: 'Allow' },
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
          Resource: { const: secretArn },
          Condition: withTags ? withTagsCondition : noTagsCondition,
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  };
}
