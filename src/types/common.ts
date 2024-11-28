/**
 * Defines a bunch of common types and interfaces
 */

export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
/**
 * Similar to Partial, but applies to nested fields as well
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Only requires the specified keys to be present in the object
 * Works on top-level keys only
 */
export type DeepPartialWithRequired<T, K extends keyof T> = DeepPartial<T> & Required<Pick<T, K>>;
