// TODO: REMOVE AND STOP USING THIS FILE
/**
 * This file contains hashmaps that represent the associations between nodes
 * These enums are specific to Level 4.
 *
 * Hashmaps:
 * - `policyToUserAssociations`: A hashmap that maps policy node IDs to user node IDs.
 * - `userToPolicyAssociations`: A hashmap that maps user node IDs to policy node IDs.
 */

import { PolicyNodeID, UserNodeID } from '../types/node-id-enums';

export const policyToUserAssocations: Record<PolicyNodeID, UserNodeID[]> = {
  [PolicyNodeID.DeveloperPolicy]: [UserNodeID.Developer1, UserNodeID.Developer2],
  [PolicyNodeID.DataScientistPolicy]: [UserNodeID.DataScientist1],
  [PolicyNodeID.InternPolicy]: [UserNodeID.Intern1, UserNodeID.Intern2],
};

export const userToPolicyAssocations: Record<UserNodeID, PolicyNodeID[]> = {
  [UserNodeID.Developer1]: [PolicyNodeID.DeveloperPolicy],
  [UserNodeID.Developer2]: [PolicyNodeID.DeveloperPolicy],
  [UserNodeID.DataScientist1]: [PolicyNodeID.DataScientistPolicy],
  [UserNodeID.Intern1]: [PolicyNodeID.InternPolicy],
  [UserNodeID.Intern2]: [PolicyNodeID.InternPolicy],
};
