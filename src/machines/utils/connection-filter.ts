import { NodeConnection } from '../types';
import { IAMNodeEntity } from '@/types';
import { getEdgeName } from '@/utils/names';

interface FilterGroup {
  filters: Array<(connection: NodeConnection) => boolean>;
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
  private connections: NodeConnection[] = [];
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

  fromConnections(connections: NodeConnection[]): ConnectionFilter {
    this.connections = connections;
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
    this.currentGroup.filters.push(connection => connection.to.id === targetId);
    return this;
  }

  whereSourceIs(sourceId: string): ConnectionFilter {
    this.currentGroup.filters.push(connection => connection.from.id === sourceId);
    return this;
  }

  whereSourceEntityIs(entity: IAMNodeEntity): ConnectionFilter {
    this.currentGroup.filters.push(connection => connection.from.data.entity === entity);
    return this;
  }

  whereTargetEntityIs(entity: IAMNodeEntity): ConnectionFilter {
    this.currentGroup.filters.push(connection => connection.to.data.entity === entity);
    return this;
  }

  whereSourceHasTag(tagKey: string, tagValue?: string): ConnectionFilter {
    this.currentGroup.filters.push(connection => {
      const tags = connection.from.data.tags || {};
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  whereTargetHasTag(tagKey: string, tagValue?: string): ConnectionFilter {
    this.currentGroup.filters.push(connection => {
      const tags = connection.to.data.tags || {};
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  // Convenience method for your specific use case
  whereEntityIs(entity: IAMNodeEntity, side: 'source' | 'target' | 'either'): ConnectionFilter {
    if (side === 'either') {
      this.currentGroup.filters.push(
        connection => connection.from.data.entity === entity || connection.to.data.entity === entity
      );
    } else if (side === 'source') {
      this.whereSourceEntityIs(entity);
    } else {
      this.whereTargetEntityIs(entity);
    }
    return this;
  }

  mapToEdgeIds(): string[] {
    return this.mapTo(connection => getEdgeName(connection.from.id, connection.to.id));
  }

  mapTo<T>(mapper: (connection: NodeConnection) => T): T[] {
    return this.build().map(mapper);
  }

  // TODO: Fix and / or operators. This implementation assumes all filters are AND
  // which is not always the case. Need to handle nested groups properly.
  build(): NodeConnection[] {
    return this.connections.filter(connection => {
      // Each filter group must pass

      return this.filterGroups.every(group => {
        if (group.operator === 'AND') {
          // All filters in AND group must pass
          return group.filters.every(filter => filter(connection));
        } else {
          // At least one filter in OR group must pass
          return group.filters.some(filter => filter(connection));
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
