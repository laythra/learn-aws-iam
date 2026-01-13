import { Viewport } from '@xyflow/react';
import _ from 'lodash';

import { getNodeInitialPosition } from '@/features/canvas/utils/node-position-geometry';
import { IAMNodeEntity } from '@/types/iam-enums';
import { NodeLayoutGroup } from '@/types/iam-layout-types';
import { IAMAnyNode } from '@/types/iam-node-types';

export function positionNewNodes(
  existingNodes: IAMAnyNode[],
  newNodes: IAMAnyNode[],
  layoutGroups: NodeLayoutGroup[],
  sidePanelWidth: number,
  viewport: Viewport
): IAMAnyNode[] {
  const layoutGroupsById = _.keyBy(layoutGroups, 'id');

  const allNodes = [...existingNodes, ...newNodes];
  const allNodesById = _.keyBy(allNodes, 'id');

  const nodeGroups = _.groupBy(allNodes, node => {
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
      sidePanelWidth,
      layoutGroup,
      parentNode
    );

    return { ...node, position };
  });
}
