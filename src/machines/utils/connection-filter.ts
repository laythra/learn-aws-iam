import { IAMEdge, IAMNodeEntity } from '@/types';

interface FilterGroup {
  filters: Array<(edge: IAMEdge) => boolean>;
  operator: 'AND' | 'OR';
}

//**
// Classic fluent interface - method chaining that reads naturally
// to build complex filters for NodeConnection objects.
// Example usage:
// const filteredConnections = ConnectionFilter.create()
//   .fromConnections(allConnections)
//   .whereSourceIs('sourceNodeId')
//   .whereTargetEntityIs(IAMNodeEntity.Policy)
//   .or()
//   .whereTargetHasTag('Environment', 'Production')
//   .and()
//   .whereSourceEntityIs(IAMNodeEntity.User)
//   .build();
// */
export class ConnectionFilter {
  private edges: IAMEdge[] = [];
  private filterGroups: FilterGroup[] = [];
  private currentGroup: FilterGroup;

  static create(): ConnectionFilter {
    return new ConnectionFilter();
  }

  constructor() {
    // Start with an AND group by default
    this.currentGroup = { filters: [], operator: 'AND' };
    this.filterGroups.push(this.currentGroup);
  }

  fromEdges(edges: IAMEdge[]): ConnectionFilter {
    this.edges = edges;
    return this;
  }

  or(): ConnectionFilter {
    this.currentGroup = { filters: [], operator: 'OR' };
    this.filterGroups.push(this.currentGroup);
    return this;
  }

  and(): ConnectionFilter {
    this.currentGroup = { filters: [], operator: 'AND' };
    this.filterGroups.push(this.currentGroup);
    return this;
  }

  whereTargetIs(targetId: string): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      return edge.data!.target_node.id === targetId;
    });
    return this;
  }

  whereTargetIn(targetIds: string[]): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      return targetIds.includes(edge.data!.target_node.id);
    });
    return this;
  }

  whereTargetNotIn(targetIds: string[]): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      return !targetIds.includes(edge.data!.target_node.id);
    });
    return this;
  }

  whereSourceIs(sourceId: string): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      return edge.source === sourceId;
    });
    return this;
  }

  whereSourceEntityIs(entity: IAMNodeEntity): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      return edge.data!.source_node.data.entity === entity;
    });
    return this;
  }

  whereSourceEntityIn(entities: IAMNodeEntity[]): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      const entity = edge.data!.source_node.data.entity;
      return entity !== undefined && entities.includes(entity);
    });
    return this;
  }

  whereTargetEntityIs(entity: IAMNodeEntity): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      return edge.data!.target_node.data.entity === entity;
    });
    return this;
  }

  whereTargetEntityIn(entities: IAMNodeEntity[]): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      const entity = edge.data!.target_node.data.entity;
      return entity !== undefined && entities.includes(entity);
    });
    return this;
  }

  whereTargetEntityNotIn(entities: IAMNodeEntity[]): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      const entity = edge.data!.target_node.data.entity;
      return entity === undefined || !entities.includes(entity);
    });
    return this;
  }

  whereSourceHasTag(tagKey: string, tagValue?: string): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      const tags = edge.data!.source_node.data.tags;
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  whereTargetHasTag(tagKey: string, tagValue?: string): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      const tags = edge.data!.target_node.data.tags;
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  whereEntityIs(entity: IAMNodeEntity, side: 'source' | 'target' | 'either'): ConnectionFilter {
    this.currentGroup.filters.push(edge => {
      const sourceEntity = edge.data!.source_node.data.entity;
      const targetEntity = edge.data!.target_node.data.entity;
      if (side === 'either') {
        return sourceEntity === entity || targetEntity === entity;
      } else if (side === 'source') {
        return sourceEntity === entity;
      } else {
        return targetEntity === entity;
      }
    });
    return this;
  }

  mapToEdgeIds(): string[] {
    return this.mapTo(edge => edge.id);
  }

  mapTo<T>(mapper: (edge: IAMEdge) => T): T[] {
    return this.build().map(mapper);
  }

  build(): IAMEdge[] {
    return this.edges.filter(edge => {
      return this.filterGroups.every(group => {
        if (group.operator === 'AND') {
          return group.filters.every(filter => filter(edge));
        } else {
          return group.filters.some(filter => filter(edge));
        }
      });
    });
  }

  #tagExists(tags: [string, string][], tagKey: string, tagValue?: string): boolean {
    return tags.some(([key, value]) => {
      return key === tagKey && (tagValue === undefined || value === tagValue);
    });
  }
}
