import { FinishEventMap } from '../types/finish-event-enums';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { IAMPolicyCreationObjective } from '@/machines/types';

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [].map(objective => createPolicyCreationObjective(objective)),
  [].map(objective => createPolicyCreationObjective(objective)),
];
