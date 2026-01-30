import { createActor, fromCallback } from 'xstate';

import storage from './storage';

function generateAnonymousId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
  }

  // if crypto is not available, fallback to a simple random string
  return `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

function getAnonymousId(): string {
  const storageKey = 'anonymous_user_id';

  let anonymousId = storage.getKey(storageKey);

  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    storage.setKey(storageKey, anonymousId);
  }

  return anonymousId;
}

const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:3000/analytics';

let anonymousId: string | null = null;

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
        if (typeof navigator === 'undefined' || !navigator.sendBeacon) return;

        if (!anonymousId) {
          anonymousId = getAnonymousId();
        }

        navigator.sendBeacon(
          ANALYTICS_URL,
          JSON.stringify({
            type: event.name,
            payload: event.payload,
            anonId: anonymousId,
          })
        );
      });
    }
  )
);

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  analyticsActor.start();
}
