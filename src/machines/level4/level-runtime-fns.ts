import dataScientistsPolicy from './schemas/edit-objectives-schemas/data-scientists-policy.json';
import developersPolicy from './schemas/edit-objectives-schemas/developers-policy.json';
import internsPolicy from './schemas/edit-objectives-schemas/interns-policy.json';
import { PolicyNodeID } from './types/node-id-enums';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ValidateFunctions = {
  [PolicyNodeID.DataScientistPolicy]: () => AJV_COMPILER.compile(dataScientistsPolicy),
  [PolicyNodeID.DeveloperPolicy]: () => AJV_COMPILER.compile(developersPolicy),
  [PolicyNodeID.InternPolicy]: () => AJV_COMPILER.compile(internsPolicy),
};

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
