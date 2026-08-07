import { generateArn } from '@/domain/arn-generator';
import { IAMNodeResourceEntity } from '@/types/iam-enums';

export const ALPHA_TEAM_SECRET_NAME = 'db/alpha-team';
export const BETA_TEAM_SECRET_NAME = 'db/beta-team';

// The canvas derives a Secret node's displayed ARN from its label via generateArn, so the
// expected ARNs in answer schemas and starter policies must come from the same source.
export const ALPHA_TEAM_SECRET_ARN = generateArn(
  IAMNodeResourceEntity.Secret,
  ALPHA_TEAM_SECRET_NAME
);
export const BETA_TEAM_SECRET_ARN = generateArn(
  IAMNodeResourceEntity.Secret,
  BETA_TEAM_SECRET_NAME
);
