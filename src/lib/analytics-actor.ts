import { createActor, fromCallback } from 'xstate';

import storage from './storage';

function getAnonymousId(): string {
  const STORAGE_KEY = 'anonymous_user_id';

  let anonymousId = storage.getKey(STORAGE_KEY);

  if (!anonymousId) {
    // Generate UUID v4
    anonymousId = crypto.randomUUID();
    storage.setKey(STORAGE_KEY, anonymousId);
  }

  return anonymousId;
}

const anonymousId = getAnonymousId();

/**
 * Shared analytics actor for tracking user progress across all level state machines.
 * This actor receives analytics events and sends them to the backend via sendBeacon.
 * Using a single shared instance across all 12 state machines avoids redundant actor creation.
 */
export const analyticsActor = createActor(
  fromCallback<{ type: 'LOG_EVENT'; name: string; payload: Record<string, unknown> }>(
    ({ receive }) => {
      receive(event => {
        if (event.type !== 'LOG_EVENT') return;

        const data = JSON.stringify({
          type: event.name,
          payload: event.payload,
          anonId: anonymousId,
          timestamp: Date.now(),
        });

        navigator.sendBeacon('http://localhost:3000/analytics', data);
      });
    }
  )
);

analyticsActor.start();
