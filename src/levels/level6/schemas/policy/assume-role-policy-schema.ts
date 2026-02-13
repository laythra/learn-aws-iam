import template from 'lodash/template';

const assumeRolePolicySchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['Version', 'Statement'],
  properties: {
    Version: {
      type: 'string',
      enum: ['2012-10-17'],
    },
    Statement: {
      minItems: 1,
      type: 'array',
      items: {
        type: 'object',
        required: ['Effect', 'Action', 'Resource'],
        properties: {
          Effect: {
            type: 'string',
            const: 'Allow',
          },
          Action: {
            oneOf: [
              {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: ['sts:AssumeRole'],
                },
                minItems: 1,
                maxItems: 1,
              },
              {
                type: 'string',
                enum: ['sts:AssumeRole'],
              },
            ],
          },
          Resource: {
            type: 'string',
            const: '<%= roleArn %>',
          },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};

export function generateAssumeRolePolicySchema(roleArn: string): object {
  const compiledTemplate = template(JSON.stringify(assumeRolePolicySchema));
  const interpolatedSchema = compiledTemplate({ roleArn });

  return JSON.parse(interpolatedSchema);
}
