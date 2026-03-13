import { isNodeOfEntity } from '@/domain/node-type-guards';
import { IAMNodeEntity, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

/**
 * Fluent interface for building filters over IAMAnyNode arrays.
 * Filters are combined with AND — every chained condition must pass.
 *
 * Example usage:
 * const filteredNodes = IAMNodeFilter.create()
 *   .fromNodes(allNodes)
 *   .whereEntityIs(IAMNodeEntity.User)
 *   .whereAccountIs('123456789')
 *   .build();
 */
export class IAMNodeFilter {
  private nodes: IAMAnyNode[] = [];
  private filters: Array<(node: IAMAnyNode) => boolean> = [];

  static create(): IAMNodeFilter {
    return new IAMNodeFilter();
  }

  fromNodes(nodes: IAMAnyNode[]): IAMNodeFilter {
    this.nodes = nodes;
    return this;
  }

  whereIdIs(nodeId: string): IAMNodeFilter {
    this.filters.push(node => node.id === nodeId);
    return this;
  }

  whereIdIsOneOf(...nodeIds: string[]): IAMNodeFilter {
    this.filters.push(node => nodeIds.includes(node.id));
    return this;
  }

  whereEntityIs(entity: IAMNodeEntity): IAMNodeFilter {
    this.filters.push(node => node.data.entity === entity);
    return this;
  }

  whereEntityIsOneOf(...entities: IAMNodeEntity[]): IAMNodeFilter {
    this.filters.push(node => entities.includes(node.data.entity));
    return this;
  }

  whereHasTag(tagKey: string, tagValue?: string): IAMNodeFilter {
    this.filters.push(node => {
      const tags = node.data.tags || [];
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  whereAccountIs(accountId: string): IAMNodeFilter {
    this.filters.push(node => node.data.account_id === accountId);
    return this;
  }

  whereIsEditable(): IAMNodeFilter {
    this.filters.push(node => {
      if (!isNodeOfEntity(node, IAMNodeEntity.IdentityPolicy)) return false;
      return node.data.editable;
    });
    return this;
  }

  whereIsNotEditable(): IAMNodeFilter {
    this.filters.push(node => {
      if (!isNodeOfEntity(node, IAMNodeEntity.IdentityPolicy)) return true;
      return !node.data.editable;
    });
    return this;
  }

  whereIsUnnecessary(): IAMNodeFilter {
    this.filters.push(node => node.data.unnecessary_node === true);
    return this;
  }

  whereIsNecessary(): IAMNodeFilter {
    this.filters.push(node => !node.data.unnecessary_node);
    return this;
  }

  whereResourceTypeIs(resourceType: IAMNodeResourceEntity): IAMNodeFilter {
    this.filters.push(node => {
      if (!isNodeOfEntity(node, IAMNodeEntity.Resource)) return false;
      return node.data.resource_type === resourceType;
    });
    return this;
  }

  whereParentIs(parentId: string): IAMNodeFilter {
    this.filters.push(node => node.data.parent_id === parentId);
    return this;
  }

  whereHasParent(): IAMNodeFilter {
    this.filters.push(node => node.data.parent_id !== undefined && node.data.parent_id !== null);
    return this;
  }

  whereIsRootNode(): IAMNodeFilter {
    this.filters.push(node => node.data.parent_id === undefined || node.data.parent_id === null);
    return this;
  }

  build(): IAMAnyNode[] {
    return this.nodes.filter(node => this.filters.every(filter => filter(node)));
  }

  #tagExists(tags: Array<[string, string]>, tagKey: string, tagValue?: string): boolean {
    return tags.some(([key, value]) => {
      return key === tagKey && (tagValue === undefined || value === tagValue);
    });
  }
}
