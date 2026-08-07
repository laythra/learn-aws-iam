/**
 * Accessors for level-specific runtime functions.
 *
 * State machines in XState must be serializable, meaning they cannot directly contain
 * function references. Functions are registered per level in the level registry
 * (`@/levels/level-registry`) behind lazy loaders, hydrated here when the level's machine
 * is loaded, and resolved by name at runtime based on the level number.
 *
 * Registered function types:
 * - validate_functions: JSON schema validators for level objectives
 * - objectives_applicable_nodes_fns: Filter functions to determine which nodes are valid targets for objectives
 * - objectives_guard_rails_blocked_edges_fns: Functions that determine if an edge should be blocked by guard rails
 *
 * @example
 * await HydrateLevelRuntimeFns(3); // done by loadLevelMachine before the machine starts
 * const validators = GetLevelValidateFunctions(3);
 */
import type { ValidateFunction } from 'ajv';

import { LEVEL_REGISTRY, LevelRuntimeFns } from '@/levels/level-registry';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

const HydratedRuntimeFns: Record<number, Partial<LevelRuntimeFns>> = {};

export const HydrateLevelRuntimeFns = async (level: number): Promise<void> => {
  if (HydratedRuntimeFns[level]) return;
  const loader = LEVEL_REGISTRY[level]?.load_runtime_fns;
  HydratedRuntimeFns[level] = loader ? await loader() : {};
};

export const GetLevelGuardRailsBlockedEdgesFns = (
  level: number
): Record<string, (edge: IAMEdge) => boolean> => {
  return HydratedRuntimeFns[level]?.objectives_guard_rails_blocked_edges_fns ?? {};
};

export const GetLevelObjectivesApplicableNodesFns = (
  level: number
): Record<string, (nodes: IAMAnyNode[]) => IAMAnyNode[]> => {
  return HydratedRuntimeFns[level]?.objectives_applicable_nodes_fns ?? {};
};

export const GetLevelValidateFunctions = (
  level: number
): Record<string, (nodes: IAMAnyNode[]) => ValidateFunction> => {
  return HydratedRuntimeFns[level]?.validate_functions ?? {};
};
