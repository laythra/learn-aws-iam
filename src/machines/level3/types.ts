import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
  LevelObjective,
} from '@/machines/types';

export type Context = GenericContext;

export type EventData =
  | GenericEventData
  | { type: 'S3_READ_POLICY_CREATED' }
  | { type: 'IAM_NODE_CONTENT_OPENED' };
export type InsideLevelMetadata = GenericInsideLevelMetadata;
export type { LevelObjective };
