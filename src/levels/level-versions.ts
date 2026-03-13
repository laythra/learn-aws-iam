/**
 * Versioned checkpoint map for each level.
 *
 * Bump the version for a level whenever you make changes that would make
 * an existing user checkpoint invalid or incompatible (e.g. new objectives,
 * restructured state, changed node IDs). This forces affected users to restart
 * the level from scratch instead of resuming a stale checkpoint.
 */
export const LEVEL_VERSIONS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  11: 1,
  12: 1,
};
