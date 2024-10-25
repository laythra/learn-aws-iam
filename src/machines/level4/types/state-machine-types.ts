import { EdgeConnectionFinishEvent, NodeEditFinishEvent } from './finish-event-enums';
import { LevelObjectiveID } from './objective-enums';
import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
  LevelObjective,
} from '@/machines/types';

export type Context = GenericContext<LevelObjectiveID>;

export type EventData =
  | GenericEventData
  | { type: NodeEditFinishEvent }
  | { type: EdgeConnectionFinishEvent };

export type InsideLevelMetadata = GenericInsideLevelMetadata;
export type { LevelObjective };
