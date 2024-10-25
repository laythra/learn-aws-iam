import { NodeCreationFinishEvent } from './finish-event-enums';
import { LevelObjectiveID } from './objective-enums';
import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
} from '@/machines/types';

export type Context = GenericContext<LevelObjectiveID>;
export type EventData = GenericEventData | { type: NodeCreationFinishEvent };
export type InsideLevelMetadata = GenericInsideLevelMetadata;
