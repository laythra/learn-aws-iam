import { LevelObjectiveID } from './objective-enums';
import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
} from '@/machines/types';

export type Context = GenericContext<LevelObjectiveID>;
export type EventData = GenericEventData;
export type InsideLevelMetadata = GenericInsideLevelMetadata;
