import _ from 'lodash';
import { Edge, Node } from 'reactflow';

import { createEdge } from '@/factories/edge-factory';
import {
  IAMAnyNodeData,
  IAMEdgeData,
  IAMGroupNodeData,
  IAMNodeEntity,
  IAMPolicyNodeData,
  IAMRoleNodeData,
  IAMUserNodeData,
} from '@/types';

function resolvePolicyToRoleEdges(roleNodes: Node<IAMRoleNodeData>[]): Edge<IAMEdgeData>[] {
  return _.flatMapDeep(roleNodes, roleNode => {
    return roleNode.data.associated_policies.map(policyId => {
      return createEdge({
        source: policyId,
        target: roleNode.id,
        data: {
          hovering_label: 'Attached to',
        },
      });
    });
  });
}

function resolveRoleToUserEdges(roleNodes: Node<IAMRoleNodeData>[]): Edge<IAMEdgeData>[] {
  return _.flatMapDeep(roleNodes, roleNode => {
    return roleNode.data.associated_users.map(userId => {
      return createEdge({
        source: roleNode.id,
        target: userId,
        data: {
          hovering_label: 'Attached to',
        },
      });
    });
  });
}

function resolveUserToResourceEdgesThroughRole(
  roleNodes: Node<IAMRoleNodeData>[],
  nodesById: Record<string, Node<IAMAnyNodeData>>
): Edge<IAMEdgeData>[] {
  return _.flatMapDeep(roleNodes, roleNode => {
    return roleNode.data.associated_users.map(userId => {
      const userToResourceEdgesThroughRole = roleNode.data.associated_policies.map(policyId => {
        const policyNode = nodesById[policyId] as Node<IAMPolicyNodeData>;
        return policyNode.data.granted_accesses.map(accessInfo => {
          return createEdge({
            source: userId,
            target: accessInfo.target_node,
            targetHandle: accessInfo.target_handle,
            data: {
              hovering_label: accessInfo.access_level,
            },
          });
        });
      });

      return [userToResourceEdgesThroughRole];
    });
  });
}

export function resolveInitialEdges(initialNodes: Node<IAMAnyNodeData>[]): Edge[] {
  const nodesById = _.keyBy(initialNodes, 'id');
  const nodesByEntity = _.groupBy(initialNodes, 'data.entity');
  const userNodes = nodesByEntity[IAMNodeEntity.User] as Node<IAMUserNodeData>[];
  const groupNodes = nodesByEntity[IAMNodeEntity.Group] as Node<IAMGroupNodeData>[];
  const roleNodes = nodesByEntity[IAMNodeEntity.Role] as Node<IAMRoleNodeData>[];

  const policyEdges = _.flatMapDeep(userNodes, userNode => {
    return userNode.data.associated_policies.map(policyId => {
      const policyToUserEdge = createEdge({
        source: policyId,
        target: userNode.id,
        data: {
          hovering_label: 'Attached to',
        },
      });
      const policyNode = nodesById[policyId] as Node<IAMPolicyNodeData>;

      const userToResourceEdges = policyNode.data.granted_accesses.map(accessInfo => {
        return createEdge({
          source: userNode.id,
          target: accessInfo.target_node,
          targetHandle: accessInfo.target_handle,
          data: {
            hovering_label: accessInfo.access_level,
          },
        });
      });

      return [policyToUserEdge, userToResourceEdges];
    });
  });

  const userToGroupEdges = _.flatMapDeep(groupNodes, groupNode => {
    return groupNode.data.associated_users.map(userId => {
      const policyToUserEdge = createEdge({
        source: userId,
        target: groupNode.id,
        data: {
          hovering_label: 'Attached to',
        },
      });

      const userToResourceEdgesThroughGroup = groupNode.data.associated_policies.map(policyId => {
        const policyNode = nodesById[policyId] as Node<IAMPolicyNodeData>;
        return policyNode.data.granted_accesses.map(accessInfo => {
          return createEdge({
            source: userId,
            target: accessInfo.target_node,
            targetHandle: accessInfo.target_handle,
            data: {
              hovering_label: accessInfo.access_level,
            },
          });
        });
      });

      return [policyToUserEdge, userToResourceEdgesThroughGroup];
    });
  });

  const policyToRoleEdges = resolvePolicyToRoleEdges(roleNodes);
  const roleToUserEdges = resolveRoleToUserEdges(roleNodes);
  const userToResourceEdgesThroughRole = resolveUserToResourceEdgesThroughRole(
    roleNodes,
    nodesById
  );

  return [
    ...policyEdges,
    ...userToGroupEdges,
    ...userToResourceEdgesThroughRole,
    ...policyToRoleEdges,
    ...roleToUserEdges,
  ];
}
