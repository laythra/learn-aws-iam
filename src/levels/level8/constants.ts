import { generateArn } from '@/domain/arn-generator';
import { IAMNodeResourceEntity } from '@/types/iam-enums';

export const SLACK_INTEGRATION_SECRET_NAME = 'slack-integration-secret';

export const SLACK_INTEGRATION_SECRET_ARN = generateArn(
  IAMNodeResourceEntity.Secret,
  SLACK_INTEGRATION_SECRET_NAME
);
