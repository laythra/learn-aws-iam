import { IAMAnyNode, IAMNodeEntity, IAMNodeResourceEntity } from '@/types';
import { isNodeOfEntity } from '@/utils/node-type-guards';

interface FilterGroup {
  filters: Array<(node: IAMAnyNode) => boolean>;
  operator: 'AND' | 'OR';
}

/**
 * Classic fluent interface - method chaining that reads naturally
 * to build complex filters for IAMAnyNode objects.
 * Example usage:
 * const filteredNodes = IAMNodeFilter.create()
 *   .fromNodes(allNodes)
 *   .whereIdIs('nodeId')
 *   .whereEntityIs(IAMNodeEntity.User)
 *   .or()
 *   .whereHasTag('Environment', 'Production')
 *   .and()
 *   .whereAccountIs('123456789')
 *   .build();
 */
export class IAMNodeFilter {
  private nodes: IAMAnyNode[] = [];
  private filterGroups: FilterGroup[] = [];
  private currentGroup: FilterGroup;

  static create(): IAMNodeFilter {
    return new IAMNodeFilter();
  }

  constructor() {
    this.currentGroup = { filters: [], operator: 'AND' };
    this.filterGroups.push(this.currentGroup);
  }

  fromNodes(nodes: IAMAnyNode[]): IAMNodeFilter {
    this.nodes = nodes;
    return this;
  }

  or(): IAMNodeFilter {
    this.currentGroup = { filters: [], operator: 'OR' };
    this.filterGroups.push(this.currentGroup);
    return this;
  }

  and(): IAMNodeFilter {
    this.filterGroups.push(this.currentGroup);
    this.currentGroup = { filters: [], operator: 'AND' };
    return this;
  }

  whereIdIs(nodeId: string): IAMNodeFilter {
    this.currentGroup.filters.push(node => node.id === nodeId);
    return this;
  }

  whereIdIsOneOf(...nodeIds: string[]): IAMNodeFilter {
    this.currentGroup.filters.push(node => nodeIds.includes(node.id));
    return this;
  }

  whereEntityIs(entity: IAMNodeEntity): IAMNodeFilter {
    this.currentGroup.filters.push(node => node.data.entity === entity);
    return this;
  }

  whereEntityIsOneOf(...entities: IAMNodeEntity[]): IAMNodeFilter {
    this.currentGroup.filters.push(node => entities.includes(node.data.entity));
    return this;
  }

  whereHasTag(tagKey: string, tagValue?: string): IAMNodeFilter {
    this.currentGroup.filters.push(node => {
      const tags = node.data.tags || [];
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  whereAccountIs(accountId: string): IAMNodeFilter {
    this.currentGroup.filters.push(node => node.data.account_id === accountId);
    return this;
  }

  whereIsEditable(): IAMNodeFilter {
    this.currentGroup.filters.push(node => {
      if (!isNodeOfEntity(node, IAMNodeEntity.Policy)) return false;

      return node.data.editable;
    });
    return this;
  }

  whereIsNotEditable(): IAMNodeFilter {
    this.currentGroup.filters.push(node => {
      if (!isNodeOfEntity(node, IAMNodeEntity.Policy)) return true;

      return !node.data.editable;
    });
    return this;
  }

  whereIsUnnecessary(): IAMNodeFilter {
    this.currentGroup.filters.push(node => node.data.unnecessary_node === true);
    return this;
  }

  whereIsNecessary(): IAMNodeFilter {
    this.currentGroup.filters.push(node => !node.data.unnecessary_node);
    return this;
  }

  whereResourceTypeIs(resourceType: IAMNodeResourceEntity): IAMNodeFilter {
    this.currentGroup.filters.push(node => {
      if (!isNodeOfEntity(node, IAMNodeEntity.Resource)) return false;

      return node.data.resource_type === resourceType;
    });
    return this;
  }

  whereParentIs(parentId: string): IAMNodeFilter {
    this.currentGroup.filters.push(node => node.data.parent_id === parentId);
    return this;
  }

  whereHasParent(): IAMNodeFilter {
    this.currentGroup.filters.push(
      node => node.data.parent_id !== undefined && node.data.parent_id !== null
    );
    return this;
  }

  whereIsRootNode(): IAMNodeFilter {
    this.currentGroup.filters.push(
      node => node.data.parent_id === undefined || node.data.parent_id === null
    );
    return this;
  }

  // TODO: Fix and / or operators. This implementation assumes all filters are AND
  // which is not always the case. Need to handle nested groups properly.
  build(): IAMAnyNode[] {
    return this.nodes.filter(node => {
      // Each filter group must pass
      return this.filterGroups.every(group => {
        if (group.operator === 'AND') {
          // All filters in AND group must pass
          return group.filters.every(filter => filter(node));
        } else {
          // At least one filter in OR group must pass
          return group.filters.some(filter => filter(node));
        }
      });
    });
  }

  #tagExists(tags: Array<[string, string]>, tagKey: string, tagValue?: string): boolean {
    return tags.some(([key, value]) => {
      return key === tagKey && (tagValue === undefined || value === tagValue);
    });
  }
}
