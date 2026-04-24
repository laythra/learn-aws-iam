import { gunzipSync } from 'zlib';

export const getTestSolution = async <K extends string>(
  testSolutions: Record<K, () => Promise<string>>,
  objectiveNumber: K
): Promise<string> => {
  try {
    const compressed = Buffer.from(await testSolutions[objectiveNumber](), 'base64');
    return gunzipSync(new Uint8Array(compressed)).toString('utf-8');
  } catch {
    throw new Error(`Failed to decode test solution for step: ${objectiveNumber}`);
  }
};

export const loadLevelStage = async <K extends string>(
  levelStages: Record<K, () => Promise<string | undefined>>,
  stageName: K
): Promise<string | undefined> => {
  const levelStage = await levelStages[stageName]();
  // Levels with undefined stage are considered empty, and should start from scratch
  if (!levelStage) return undefined;

  const compressed = Buffer.from(levelStage, 'base64');
  return gunzipSync(new Uint8Array(compressed)).toString('utf-8');
};
