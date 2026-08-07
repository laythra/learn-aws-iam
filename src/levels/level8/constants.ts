import { generateArn } from '@/domain/arn-generator';
import { IAMNodeResourceEntity } from '@/types/iam-enums';

export const SLACK_INTEGRATION_SECRET_NAME = 'slack-integration-secret';

// The canvas derives a Secret node's displayed ARN from its label via generateArn, so the
// expected ARNs in answer schemas and starter policies must come from the same source.
export const SLACK_INTEGRATION_SECRET_ARN = generateArn(
  IAMNodeResourceEntity.Secret,
  SLACK_INTEGRATION_SECRET_NAME
);
