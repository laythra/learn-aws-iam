import type { Node, Edge } from 'reactflow';

import { IAMAnyNodeData, IAMEdgeData, IAMGroupNodeData, IAMNodeEntity } from '@/types';
import { getEdgeName } from '@/utils/names';

export function getUserToResourceEdgesForGroupAccess(
  groupNode: Node<IAMGroupNodeData>,
  allNodes: Node<IAMAnyNodeData>[]
): Edge<IAMEdgeData>[] {
  const attachedUsers = groupNode.data.attached_users;
  const attachedPolicies = groupNode.data.attached_policies;

  if (!attachedUsers || !attachedPolicies) {
    return [];
  }

  const resourceIds = attachedPolicies.flatMap(policy => Object.keys(policy.granted_accesses));

  return resourceIds.flatMap(resourceId => {
    return attachedUsers.map(
      user =>
        ({
          id: getEdgeName(user.id, resourceId),
          source: user.id,
          target: resourceId,
          style: { stroke: '#03346E' },
          sourceHandle: 'top',
          targetHandle: 'bottom',
          label: 'Has access to',
          animated: true,
          deletable: false,
          data: {
            source_node_data: user,
            target_node_data: allNodes.find(node => node.id === resourceId)?.data,
          },
        }) as Edge<IAMEdgeData>
    );
  });
}

const policyToUserConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.User}`;

export const edgeConnectionHandlers: Record<string, string> = {
  [policyToUserConnectionKey]: 'ATTACH_POLICY_TO_USER',
};
