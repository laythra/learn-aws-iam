import { produce } from 'immer';
import _ from 'lodash';
import { Node } from 'reactflow';

import { BaseFinishEventMap, GenericContext } from '../types';
import {
  IAMAnyNodeData,
  IAMNodeEntity,
  IAMNodeWithPolicies,
  IAMNodeWithRoles,
  IAMNodeWithUsers,
  IAMPolicyNodeData,
  IAMRoleNodeData,
  IAMUserNodeData,
} from '@/types';
import { isNodeOfAnyEntity, isNodeOfEntity } from '@/utils/node-type-guards';

// --- Strategy Map ---
// Each strategy takes context, sourceNode, and targetNode,
// and returns an object with the new edges and any side effect events.
const associationStrategies = {
  policyToEntity: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    policyNode: Node<IAMPolicyNodeData>,
    destinationNode: Node<IAMNodeWithPolicies>
  ) => {
    return produce(context.nodes, draftNodes => {
      const nodesById = _.keyBy(draftNodes, 'id');
      const targetNode = nodesById[destinationNode.id] as Node<IAMNodeWithPolicies>;
      targetNode.data.associated_policies.push(policyNode.id);
    });
  },
  userToEntity: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    userNode: Node<IAMUserNodeData>,
    destinationNode: Node<IAMNodeWithUsers>
  ) => {
    return produce(context.nodes, draftNodes => {
      const nodesById = _.keyBy(draftNodes, 'id');
      const targetNode = nodesById[destinationNode.id] as Node<IAMNodeWithUsers>;
      targetNode.data.associated_users.push(userNode.id);
    });
  },
  roleToEntity: <TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
    context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
    roleNode: Node<IAMRoleNodeData>,
    destinationNode: Node<IAMNodeWithRoles>
  ) => {
    return produce(context.nodes, draftNodes => {
      const nodesById = _.keyBy(draftNodes, 'id');
      const targetNode = nodesById[destinationNode.id] as Node<IAMNodeWithRoles>;
      targetNode.data.associated_roles.push(roleNode.id);
    });
  },
} as const;

// --- Generic Connection Updater ---
// Determines the connection type and applies the corresponding strategy.
export function connectNodes<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  sourceNode: Node<IAMAnyNodeData>,
  targetNode: Node<IAMAnyNodeData>
): Node<IAMAnyNodeData>[] {
  if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Policy) &&
    isNodeOfAnyEntity(targetNode, [IAMNodeEntity.User, IAMNodeEntity.Group, IAMNodeEntity.Role])
  ) {
    return associationStrategies.policyToEntity(
      context,
      sourceNode,
      targetNode as Node<IAMNodeWithPolicies>
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.User) &&
    isNodeOfAnyEntity(targetNode, [IAMNodeEntity.Group, IAMNodeEntity.Role])
  ) {
    return associationStrategies.userToEntity(
      context,
      sourceNode,
      targetNode as Node<IAMNodeWithUsers>
    );
  } else if (
    isNodeOfEntity(sourceNode, IAMNodeEntity.Role) &&
    isNodeOfAnyEntity(targetNode, [IAMNodeEntity.User, IAMNodeEntity.Resource])
  ) {
    return associationStrategies.roleToEntity(
      context,
      sourceNode,
      targetNode as Node<IAMNodeWithRoles>
    );
  }

  throw new Error('Unsupported connection type');
}
