/**
 * Defines a bunch of common types and interfaces
 */

export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
