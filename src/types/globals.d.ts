export {};

declare global {
  interface Array<T> {
    filterMap<U>(callback: (value: T, index: number, array: T[]) => U | null | undefined): U[];
  }
}
