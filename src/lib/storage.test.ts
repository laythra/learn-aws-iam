import { beforeEach, describe, expect, it } from 'vitest';

import storage from '@/lib/storage';

beforeEach(() => {
  localStorage.clear();
});

describe('storage', () => {
  describe('setKey / getKey', () => {
    it('stores and retrieves a value', () => {
      storage.setKey('Maki', 'Zenin');

      expect(localStorage.getItem('Maki')).toBe('Zenin');
      expect(storage.getKey('Maki')).toBe('Zenin');
    });

    it('returns default value when key does not exist', () => {
      expect(storage.getKey('missing', 'fallback')).toBe('fallback');
    });

    it('returns empty string as default when no default provided', () => {
      expect(storage.getKey('missing')).toBe('');
    });
  });

  describe('removeKey', () => {
    it('removes a prefixed key from localStorage', () => {
      storage.setKey('token', 'abc');
      expect(storage.getKey('token')).toBe('abc');

      storage.removeKey('token');
      expect(storage.getKey('token')).toBe('');
    });
  });
});
