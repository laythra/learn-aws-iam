import { Actor, AnyActorLogic } from 'xstate';

import { createEventBus } from '@/lib/event-bus';

type LevelEvents = {
  store_checkpoint: { actor: Actor<AnyActorLogic> };
  store_snapshot_to_disk: { actor: Actor<AnyActorLogic>; filename: string };
};

// An event bus used mainly for communication between levels and runtime
// Without it, we have to import runtime functions inside levels, which creates a circular dependency
// since runtime also imports levels for level details and functions registry
export const LevelEventBus = createEventBus<LevelEvents>();
