import template from 'lodash/template';

const delegatePermissionsPolicySchema = {
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
      items: {
        type: 'object',
        required: ['Effect', 'Action', 'Resource', 'Condition'],
        properties: {
          Effect: {
            type: 'string',
            enum: ['Allow'],
          },
          Action: {
            type: 'array',
            minItems: 2,
            maxItems: 2,
            uniqueItems: true,
            items: {
              type: 'string',
              enum: ['iam:AttachRolePolicy', 'iam:DetachRolePolicy', 'iam:CreateRolePolicy'],
            },
          },
          Resource: {
            oneOf: [
              {
                type: 'array',
                minItems: 1,
                maxItems: 1,
                uniqueItems: true,
                items: {
                  enum: ['*'],
                },
              },
              {
                type: 'string',
                enum: ['*'],
              },
            ],
          },
          Condition: {
            type: 'object',
            required: ['StringEquals'],
            properties: {
              StringEquals: {
                type: 'object',
                properties: {
                  'iam:PermissionsBoundary': {
                    const: '<%= permissionBoundaryId %>',
                  },
                },
                required: ['iam:PermissionsBoundary'],
              },
            },
          },
        },
      },
    },
  },
  additionalProperties: false,
};

export function generateAssumeRolePolicySchema(permissionBoundaryId: string): object {
  const compiledTemplate = template(JSON.stringify(delegatePermissionsPolicySchema));
  const interpolatedSchema = compiledTemplate({ permissionBoundaryId });

  return JSON.parse(interpolatedSchema);
}
