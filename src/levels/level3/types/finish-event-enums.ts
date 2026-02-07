import { FinishEventMapWithDefaults, ObjectiveType } from '@/levels/types/objective-types';

export enum LevelObjectiveFinishEvent {
  LEVEL_OBJECTIVE_FINISHED = 'LEVEL_OBJECTIVE_FINISHED',
}

export enum EdgeConnectionFinishEvent {
  S3_READ_WRITE_POLICY_CONNECTED = 'S3_READ_WRITE_POLICY_CONNECTED',
  CLOUDFRONT_READ_POLICY_CONNECTED = 'CLOUDFRONT_READ_POLICY_CONNECTED',
  DYNAMO_DB_READ_WRITE_POLICY_CONNECTED = 'DYNAMO_DB_READ_WRITE_POLICY_CONNECTED',
}

// TODO: Rename to PolicyCreationFinishEvent instead
export enum NodeCreationFinishEvent {
  S3_READ_POLICY_CREATED = 'S3_READ_POLICY_CREATED',
  S3_READ_WRITE_POLICY_CREATED = 'S3_READ_WRITE_POLICY_CREATED',
  DYNAMO_DB_READ_WRITE_POLICY_CREATED = 'DYNAMO_DB_READ_WRITE_POLICY_CREATED',
  CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED = 'CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: NodeCreationFinishEvent;
  [ObjectiveType.LEVEL_OBJECTIVE]: LevelObjectiveFinishEvent;
}>;
