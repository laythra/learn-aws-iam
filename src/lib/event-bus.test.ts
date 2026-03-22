import { describe, it, expect, vi } from 'vitest';

import { createEventBus } from './event-bus';

type TestEvents = {
  greet: { name: string };
  count: { value: number };
};

describe('createEventBus', () => {
  it('calls handler when event is emitted', () => {
    const bus = createEventBus<TestEvents>();
    const handler = vi.fn();

    bus.on('greet', handler);
    bus.emit('greet', { name: 'Alice' });

    expect(handler).toHaveBeenCalledWith({ name: 'Alice' });
  });

  it('supports multiple handlers for the same event', () => {
    const bus = createEventBus<TestEvents>();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    bus.on('greet', handler1);
    bus.on('greet', handler2);
    bus.emit('greet', { name: 'Bob' });

    expect(handler1).toHaveBeenCalledWith({ name: 'Bob' });
    expect(handler2).toHaveBeenCalledWith({ name: 'Bob' });
  });

  it('does not call handlers for different events', () => {
    const bus = createEventBus<TestEvents>();
    const greetHandler = vi.fn();
    const countHandler = vi.fn();

    bus.on('greet', greetHandler);
    bus.on('count', countHandler);
    bus.emit('greet', { name: 'Charlie' });

    expect(greetHandler).toHaveBeenCalledOnce();
    expect(countHandler).not.toHaveBeenCalled();
  });

  it('unsubscribes when calling the returned cleanup function', () => {
    const bus = createEventBus<TestEvents>();
    const handler = vi.fn();

    const unsubscribe = bus.on('greet', handler);
    unsubscribe();
    bus.emit('greet', { name: 'Dave' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not affect other handlers when one unsubscribes', () => {
    const bus = createEventBus<TestEvents>();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const unsubscribe1 = bus.on('greet', handler1);
    bus.on('greet', handler2);
    unsubscribe1();
    bus.emit('greet', { name: 'Eve' });

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledWith({ name: 'Eve' });
  });

  it('does nothing when emitting with no handlers', () => {
    const bus = createEventBus<TestEvents>();
    expect(() => bus.emit('greet', { name: 'Nobody' })).not.toThrow();
  });
});
