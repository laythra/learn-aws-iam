import { Viewport } from '@xyflow/react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';

import { getNodeInitialPosition } from '@/features/canvas/utils/node-position-geometry';
import { IAMNodeEntity } from '@/types/iam-enums';
import { NodeLayoutGroup } from '@/types/iam-layout-types';
import { IAMAnyNode } from '@/types/iam-node-types';

/**
 * A helper function that takes in new nodes and applies initial positions to them based on the current layout groups,
 * side panel width, and react flow viewport.
 * @param existingNodes the nodes already present on the canvas before adding any new nodes
 * @param newNodes the nodes being added that need initial positions assigned
 * @param layoutGroups the layout group configurations used to determine how and where nodes are placed
 * @param sidePanelWidth the current width of the side panel, used to offset non-account nodes horizontally
 * @param viewport the current React Flow viewport that defines the visible area and zoom for positioning
 * @returns the new nodes with positions applied
 */
export function positionNewNodes(
  existingNodes: IAMAnyNode[],
  newNodes: IAMAnyNode[],
  layoutGroups: NodeLayoutGroup[],
  sidePanelWidth: number,
  viewport: Viewport
): IAMAnyNode[] {
  const layoutGroupsById = keyBy(layoutGroups, 'id');

  const allNodes = [...existingNodes, ...newNodes];
  const allNodesById = keyBy(allNodes, 'id');

  const nodeGroups = groupBy(allNodes, node => {
    const isAccountNode = node.data.entity === IAMNodeEntity.Account;
    const hasParent = !!node.parentId;

    if (hasParent) return `child-${node.parentId}-${node.data.layout_group_id}`;
    if (isAccountNode) return `account-${node.data.layout_group_id}`;

    return node.data.layout_group_id;
  });

  return newNodes.map(node => {
    let groupKey = node.data.layout_group_id;
    const isAccountNode = node.data.entity === IAMNodeEntity.Account;
    const hasParent = !!node.parentId;

    if (hasParent) groupKey = `child-${node.parentId}-${node.data.layout_group_id}`;
    if (isAccountNode) groupKey = `account-${node.data.layout_group_id}`;

    const group = nodeGroups[groupKey];

    const layoutGroup = layoutGroupsById[node.data.layout_group_id];
    const parentNode = node.parentId ? allNodesById[node.parentId] : undefined;

    // Only count visible nodes when placing
    const visibleGroup = group.filter(n => !n.hidden);

    const indexInGroup = visibleGroup.findIndex(n => n.id === node.id);

    const position = getNodeInitialPosition(
      node,
      viewport,
      visibleGroup.length,
      indexInGroup,
      // If the node is an account, disregard the side panel width when calculating initial position
      // since account nodes are unaffected by the side panel
      node.data.entity === IAMNodeEntity.Account ? 0 : sidePanelWidth,
      layoutGroup,
      parentNode
    );

    return { ...node, position };
  });
}
