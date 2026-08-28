import { generateArn } from '@/domain/arn-generator';
import { IAMNodeResourceEntity } from '@/types/iam-enums';

export const ALPHA_TEAM_SECRET_NAME = 'db/alpha-team';
export const BETA_TEAM_SECRET_NAME = 'db/beta-team';

export const ALPHA_TEAM_SECRET_ARN = generateArn(
  IAMNodeResourceEntity.Secret,
  ALPHA_TEAM_SECRET_NAME
);
export const BETA_TEAM_SECRET_ARN = generateArn(
  IAMNodeResourceEntity.Secret,
  BETA_TEAM_SECRET_NAME
);
