import { LevelObjectiveID } from './objective-enums';
import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
} from '@/machines/types';

export type Context = GenericContext<LevelObjectiveID>;

export type EventData =
  | GenericEventData
  | { type: 'S3_READ_POLICY_CREATED' }
  | { type: 'DYNAMO_READ_WRITE_POLICY_CREATED' }
  | { type: 'CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED' }
  | { type: 'IAM_NODE_CONTENT_OPENED' };
export type InsideLevelMetadata = GenericInsideLevelMetadata;
