import { gunzipSync } from 'zlib';

export const getTestSolution = <K extends string>(
  testSolutions: Record<K, string>,
  objectiveNumber: K
): string => {
  try {
    const compressed = Buffer.from(testSolutions[objectiveNumber], 'base64');
    return gunzipSync(new Uint8Array(compressed)).toString('utf-8');
  } catch (error) {
    throw new Error(`Failed to decode test solution for step: ${objectiveNumber}`);
  }
};
