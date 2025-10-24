import { ValidateFunction } from 'ajv';

import {
  ObjectivesApplicableNodesFns as Level10ObjectivesApplicableNodesFns,
  ValidateFunctions as Level10ValidateFunctions,
} from './level10/level-runtime-fns';
import {
  ValidateFunctions as Level11ValidateFunctions,
  GuardRailsBlockedEdgesFunctions as Level11GuardRailsBlockedEdgesFunctions,
} from './level11/level-runtime-fns';
import {
  ObjectivesApplicableNodesFns as Level12ObjectivesApplicableNodesFns,
  ValidateFunctions as Level12ValidateFunctions,
} from './level12/level-runtime-fns';
import { ValidateFunctions as Level3ValidateFunctions } from './level3/level-runtime-fns';
import { ValidateFunctions as Level5ValidateFunctions } from './level5/level-runtime-fns';
import { ValidateFunctions as Level6ValidateFunctions } from './level6/level-runtime-fns';
import { ValidateFunctions as Level7ValidateFunctions } from './level7/level-runtime-fns';
import {
  ObjectivesApplicableNodesFns as Level8ObjectivesApplicableNodesFns,
  ValidateFunctions as Level8ValidateFunctions,
} from './level8/level-runtime-fns';
import {
  ObjectivesApplicableNodesFns as Level9ObjectivesApplicableNodesFns,
  ValidateFunctions as Level9ValidateFunctions,
} from './level9/level-runtime-fns';
import { IAMAnyNode, IAMEdge } from '@/types';

type RegistryFns = {
  objectives_applicable_nodes_fns: Record<string, (nodes: IAMAnyNode[]) => IAMAnyNode[]>;
  objectives_guard_rails_blocked_edges_fns: Record<string, (edge: IAMEdge) => boolean>;
  validate_functions: Record<string, (nodes: IAMAnyNode[]) => ValidateFunction>;
};

const FunctionsRegistry: Record<number, Partial<RegistryFns>> = {
  3: {
    validate_functions: Level3ValidateFunctions,
  },
  5: {
    validate_functions: Level5ValidateFunctions,
  },
  6: {
    validate_functions: Level6ValidateFunctions,
  },
  7: {
    validate_functions: Level7ValidateFunctions,
  },
  8: {
    objectives_applicable_nodes_fns: Level8ObjectivesApplicableNodesFns,
    validate_functions: Level8ValidateFunctions,
  },
  9: {
    objectives_applicable_nodes_fns: Level9ObjectivesApplicableNodesFns,
    validate_functions: Level9ValidateFunctions,
  },
  10: {
    objectives_applicable_nodes_fns: Level10ObjectivesApplicableNodesFns,
    validate_functions: Level10ValidateFunctions,
  },
  11: {
    validate_functions: Level11ValidateFunctions,
    objectives_guard_rails_blocked_edges_fns: Level11GuardRailsBlockedEdgesFunctions,
  },
  12: {
    objectives_applicable_nodes_fns: Level12ObjectivesApplicableNodesFns,
    validate_functions: Level12ValidateFunctions,
  },
};

export const GetLevelGuardRailsBlockedEdgesFns = (
  level: number
): Record<string, (edge: IAMEdge) => boolean> => {
  return FunctionsRegistry[level]?.objectives_guard_rails_blocked_edges_fns ?? {};
};

export const GetLevelObjectivesApplicableNodesFns = (
  level: number
): Record<string, (nodes: IAMAnyNode[]) => IAMAnyNode[]> => {
  return FunctionsRegistry[level]?.objectives_applicable_nodes_fns ?? {};
};

export const GetLevelValidateFunctions = (
  level: number
): Record<string, (nodes: IAMAnyNode[]) => ValidateFunction> => {
  return FunctionsRegistry[level]?.validate_functions ?? {};
};
