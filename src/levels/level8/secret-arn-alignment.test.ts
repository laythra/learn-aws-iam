import { describe, expect, it } from 'vitest';

import { SLACK_INTEGRATION_SECRET_ARN, SLACK_INTEGRATION_SECRET_NAME } from './constants';
import { INITIAL_POLICIES } from './initial-policies';
import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './nodes/resource-nodes';
import { generateSlackManageServiceSchema } from './schemas/slack-manage-service-policy';
import { IAMNodeResourceEntity } from '@/types/iam-enums';

function collectSecretArnConsts(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectSecretArnConsts);
  if (typeof value !== 'object' || value === null) return [];

  return Object.entries(value).flatMap(([key, child]) =>
    key === 'const' && typeof child === 'string' && child.startsWith('arn:aws:secretsmanager')
      ? [child]
      : collectSecretArnConsts(child)
  );
}

describe('level 8 secret ARN alignment', () => {
  it('labels the secret node with the name the ARN constant derives from', () => {
    const secretLabels = INITIAL_IN_LEVEL_RESOURCE_NODES.filter(
      node => node.data.resource_type === IAMNodeResourceEntity.Secret
    ).map(node => node.data.label);

    expect(secretLabels).toEqual([SLACK_INTEGRATION_SECRET_NAME]);
  });

  it('uses the derived ARN in the starter policy', () => {
    expect(INITIAL_POLICIES.SECRETS_ACCESS.Statement[0].Resource).toBe(
      SLACK_INTEGRATION_SECRET_ARN
    );
  });

  it('injects the derived ARN into both generated answer schemas', () => {
    for (const withTags of [false, true]) {
      const schema = generateSlackManageServiceSchema(SLACK_INTEGRATION_SECRET_ARN, { withTags });
      const arns = collectSecretArnConsts(schema);

      expect(arns.length).toBeGreaterThan(0);
      for (const arn of arns) expect(arn).toBe(SLACK_INTEGRATION_SECRET_ARN);
    }
  });
});
