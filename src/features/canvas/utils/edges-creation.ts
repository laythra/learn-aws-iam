import _ from 'lodash';
import type { Node, Edge } from 'reactflow';

import {
  IAMAnyNodeData,
  IAMEdgeData,
  IAMGroupNodeData,
  IAMPolicyNodeData,
  IAMUserNodeData,
  IAMNodeEntity,
} from '@/types';
import { getEdgeName } from '@/utils/names';

type AttachFunction = (
  sourceNode: Node<IAMAnyNodeData>,
  targetNode: Node<IAMAnyNodeData>
) => Node<IAMAnyNodeData>;

function attachUserToGroup(
  userNode: Node<IAMUserNodeData>,
  groupNode: Node<IAMGroupNodeData>
): Node<IAMGroupNodeData> {
  const groupNodeData = groupNode.data;
  const userNodeData = userNode.data;

  let newAttachedUsers: IAMUserNodeData[];

  if (groupNodeData.attached_users) {
    newAttachedUsers = [...groupNodeData.attached_users, userNodeData];
  } else {
    newAttachedUsers = [userNodeData];
  }

  return _.chain(groupNode).cloneDeep().set(['data', 'attached_users'], newAttachedUsers).value();
}

function attachPolicyToGroup(
  policyNode: Node<IAMPolicyNodeData>,
  groupNode: Node<IAMGroupNodeData>
): Node<IAMGroupNodeData> {
  const groupNodeData = groupNode.data;
  const policyNodeData = policyNode.data;

  let newAttachedPolicies: IAMPolicyNodeData[];

  if (groupNodeData.attached_policies) {
    newAttachedPolicies = [...groupNodeData.attached_policies, policyNodeData];
  } else {
    newAttachedPolicies = [policyNodeData];
  }

  return _.chain(groupNode)
    .cloneDeep()
    .set(['data', 'attached_policies'], newAttachedPolicies)
    .value();
}

function attachPolicyToUser(
  policyNode: Node<IAMPolicyNodeData>,
  userNode: Node<IAMUserNodeData>
): Node<IAMUserNodeData> {
  const userNodeData = userNode.data;
  const policyNodeData = policyNode.data;
  const newAttachedPolicies: string[] = _.uniq([
    ...userNodeData.associated_policies,
    policyNodeData.id,
  ]);

  return _.chain(userNode)
    .cloneDeep()
    .set(['data', 'associated_policies'], newAttachedPolicies)
    .value();
}

export function getUserToResourceEdgesForGroupAccess(
  groupNode: Node<IAMGroupNodeData>,
  allNodes: Node<IAMAnyNodeData>[]
): Edge<IAMEdgeData>[] {
  const attachedUsers = groupNode.data.attached_users;
  const attachedPolicies = groupNode.data.attached_policies;

  if (!attachedUsers || !attachedPolicies) {
    return [];
  }

  const resourceIds = attachedPolicies.flatMap(policy => policy.resources_affected);

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

const userToGroupConnectionKey = `${IAMNodeEntity.User}-${IAMNodeEntity.Group}`;
const policyToGroupConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.Group}`;
const policyToUserConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.User}`;

// This mapping should be used to determine which connection handler to use
// when connecting two nodes in the canvas, based on the type of the source and target nodes
export const edgeConnectionHandlers: Record<string, AttachFunction> = {
  [userToGroupConnectionKey]: (sourceNode, targetNode) =>
    attachUserToGroup(sourceNode as Node<IAMUserNodeData>, targetNode as Node<IAMGroupNodeData>),
  [policyToGroupConnectionKey]: (sourceNode, targetNode) =>
    attachPolicyToGroup(
      sourceNode as Node<IAMPolicyNodeData>,
      targetNode as Node<IAMGroupNodeData>
    ),
  [policyToUserConnectionKey]: (sourceNode, targetNode) =>
    attachPolicyToUser(sourceNode as Node<IAMPolicyNodeData>, targetNode as Node<IAMUserNodeData>),
};
