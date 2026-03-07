import dataScientistsPolicy from './schemas/data-scientists-policy.json';
import developersPolicy from './schemas/developers-policy.json';
import internsPolicy from './schemas/interns-policy.json';
import { PolicyNodeID } from './types/node-id-enums';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';

export const ValidateFunctions = {
  [PolicyNodeID.DataScientistPolicy]: () => AJV_COMPILER.compile(dataScientistsPolicy),
  [PolicyNodeID.DeveloperPolicy]: () => AJV_COMPILER.compile(developersPolicy),
  [PolicyNodeID.InternPolicy]: () => AJV_COMPILER.compile(internsPolicy),
};

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
