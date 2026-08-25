import { describe, expect, it } from 'vitest';

import {
  ALPHA_TEAM_SECRET_ARN,
  ALPHA_TEAM_SECRET_NAME,
  BETA_TEAM_SECRET_ARN,
  BETA_TEAM_SECRET_NAME,
} from './constants';
import { INITIAL_POLICIES } from './initial-policies';
import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './nodes/resource-nodes';
import { generateRdsManagePolicySchema } from './schemas/per-team-rds-manage-policy';
import { IAMNodeResourceEntity } from '@/types/iam-enums';

describe('level 9 secret ARN alignment', () => {
  it('labels the secret nodes with the names the ARN constants derive from', () => {
    const secretLabels = INITIAL_IN_LEVEL_RESOURCE_NODES.filter(
      node => node.data.resource_type === IAMNodeResourceEntity.Secret
    ).map(node => node.data.label);

    expect(secretLabels).toEqual([ALPHA_TEAM_SECRET_NAME, BETA_TEAM_SECRET_NAME]);
  });

  it('uses the derived ARNs in the starter policies', () => {
    expect(INITIAL_POLICIES.ALPHA_TEAM_RDS_POLICY.Statement[0].Resource).toBe(
      ALPHA_TEAM_SECRET_ARN
    );
    expect(INITIAL_POLICIES.BETA_TEAM_RDS_POLICY.Statement[0].Resource).toBe(BETA_TEAM_SECRET_ARN);
  });

  it('uses the derived ARNs in the generated answer schemas', () => {
    const alphaSchema = generateRdsManagePolicySchema('alpha-team', ALPHA_TEAM_SECRET_ARN) as {
      definitions: { secretStatement: { properties: { Resource: { const: string } } } };
    };

    expect(alphaSchema.definitions.secretStatement.properties.Resource.const).toBe(
      ALPHA_TEAM_SECRET_ARN
    );
  });
});
