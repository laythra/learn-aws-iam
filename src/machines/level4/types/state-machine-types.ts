import { FinishEventMap, NodeEditFinishEvent } from './finish-event-enums';
import { LevelObjectiveID } from './objective-enums';
import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
  LevelObjective,
} from '@/machines/types';

export type Context = GenericContext<LevelObjectiveID, FinishEventMap>;
export type EventData = GenericEventData<FinishEventMap> | { type: NodeEditFinishEvent };

export type InsideLevelMetadata = GenericInsideLevelMetadata;
export type { LevelObjective };
