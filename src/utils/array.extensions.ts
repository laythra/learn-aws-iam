export {};

// Javascript has no built-in filterMap function, which performs a map and filter in one step.
if (!Array.prototype.filterMap) {
  Array.prototype.filterMap = function <T, U>(
    this: T[],
    callback: (value: T, index: number, array: T[]) => U | null | undefined
  ): U[] {
    const result: U[] = [];
    for (let i = 0; i < this.length; i++) {
      const mapped = callback(this[i], i, this);
      if (mapped != null) {
        result.push(mapped);
      }
    }
    return result;
  };
}
