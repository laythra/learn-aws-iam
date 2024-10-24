import { EdgeConnectionFinishEvent } from '../objectives/edge-connection-objectives';
import type {
  GenericContext,
  GenericEventData,
  GenericInsideLevelMetadata,
  LevelObjective,
  NodeCreationFinishEvent,
  NodeEditFinishEvent,
} from '@/machines/types';

export type Context = GenericContext;

export type EventData =
  | GenericEventData
  | { type: EdgeConnectionFinishEvent }
  | { type: NodeCreationFinishEvent }
  | { type: NodeEditFinishEvent };

export type InsideLevelMetadata = GenericInsideLevelMetadata;
export type { LevelObjective };
