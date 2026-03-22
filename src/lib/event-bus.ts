type EventHandler<T> = (payload: T) => void;

type EventMap = Record<string, unknown>;

interface EventBus<T extends EventMap> {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void;
  emit<K extends keyof T>(event: K, payload: T[K]): void;
}

// a simple pub-sub event bus implementation
// allows for events to be emitted through the `emit` method and listened to through the `on` method
// Useful for when we want to allow decoupled communication between different parts of the app without direct imports
export function createEventBus<T extends EventMap>(): EventBus<T> {
  const handlers: { [K in keyof T]?: EventHandler<T[K]>[] } = {};

  return {
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void {
      if (!handlers[event]) handlers[event] = [];
      handlers[event]!.push(handler);

      return () => {
        handlers[event] = handlers[event]!.filter(h => h !== handler) as (typeof handlers)[K];
      };
    },

    emit<K extends keyof T>(event: K, payload: T[K]): void {
      handlers[event]?.forEach(handler => handler(payload));
    },
  };
}
