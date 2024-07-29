import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
  LevelObjective,
} from '@/machines/types';

export type Context = GenericContext & { temp: string };
export type EventData =
  | GenericEventData
  | { type: 'CREATE_GROUP_POPUP_OPENED' }
  | { type: 'IAM_GROUP_CREATED' }
  | { type: 'ALL_USERS_ATTACHED_TO_GROUP' }
  | { type: 'ALL_POLICIES_ATTACHED_TO_GROUP' }
  | { type: 'IAM_USER_1_ATTACHED_TO_GROUP' }
  | { type: 'IAM_USER_2_ATTACHED_TO_GROUP' }
  | { type: 'IAM_USER_3_ATTACHED_TO_GROUP' }
  | { type: 'NEW_USER_ATTACHED_TO_GROUP' };
export type InsideLevelMetadata = GenericInsideLevelMetadata;
export type { LevelObjective };
