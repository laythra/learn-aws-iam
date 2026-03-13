import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMEdge } from '@/types/iam-node-types';

/**
 * Fluent interface for building filters over IAMEdge arrays.
 * Filters are combined with AND — every chained condition must pass.
 *
 * Example usage:
 * const filteredEdges = ConnectionFilter.create()
 *   .fromEdges(allEdges)
 *   .whereSourceIs('sourceNodeId')
 *   .whereTargetEntityIs(IAMNodeEntity.IdentityPolicy)
 *   .build();
 */
export class ConnectionFilter {
  private edges: IAMEdge[] = [];
  private filters: Array<(edge: IAMEdge) => boolean> = [];

  static create(): ConnectionFilter {
    return new ConnectionFilter();
  }

  fromEdges(edges: IAMEdge[]): ConnectionFilter {
    this.edges = edges;
    return this;
  }

  whereTargetIs(targetId: string): ConnectionFilter {
    this.filters.push(edge => edge.data!.target_node.id === targetId);
    return this;
  }

  whereTargetIn(targetIds: string[]): ConnectionFilter {
    this.filters.push(edge => targetIds.includes(edge.data!.target_node.id));
    return this;
  }

  whereTargetNotIn(targetIds: string[]): ConnectionFilter {
    this.filters.push(edge => !targetIds.includes(edge.data!.target_node.id));
    return this;
  }

  whereSourceIs(sourceId: string): ConnectionFilter {
    this.filters.push(edge => edge.source === sourceId);
    return this;
  }

  whereSourceEntityIs(entity: IAMNodeEntity): ConnectionFilter {
    this.filters.push(edge => edge.data!.source_node.data.entity === entity);
    return this;
  }

  whereSourceEntityIn(entities: IAMNodeEntity[]): ConnectionFilter {
    this.filters.push(edge => {
      const entity = edge.data!.source_node.data.entity;
      return entity !== undefined && entities.includes(entity);
    });
    return this;
  }

  whereTargetEntityIs(entity: IAMNodeEntity): ConnectionFilter {
    this.filters.push(edge => edge.data!.target_node.data.entity === entity);
    return this;
  }

  whereTargetEntityIn(entities: IAMNodeEntity[]): ConnectionFilter {
    this.filters.push(edge => {
      const entity = edge.data!.target_node.data.entity;
      return entity !== undefined && entities.includes(entity);
    });
    return this;
  }

  whereTargetEntityNotIn(entities: IAMNodeEntity[]): ConnectionFilter {
    this.filters.push(edge => {
      const entity = edge.data!.target_node.data.entity;
      return entity === undefined || !entities.includes(entity);
    });
    return this;
  }

  whereSourceHasTag(tagKey: string, tagValue?: string): ConnectionFilter {
    this.filters.push(edge => {
      const tags = edge.data!.source_node.data.tags;
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  whereTargetHasTag(tagKey: string, tagValue?: string): ConnectionFilter {
    this.filters.push(edge => {
      const tags = edge.data!.target_node.data.tags;
      return this.#tagExists(tags, tagKey, tagValue);
    });
    return this;
  }

  whereEntityIs(entity: IAMNodeEntity, side: 'source' | 'target' | 'either'): ConnectionFilter {
    this.filters.push(edge => {
      const sourceEntity = edge.data!.source_node.data.entity;
      const targetEntity = edge.data!.target_node.data.entity;
      if (side === 'either') return sourceEntity === entity || targetEntity === entity;
      if (side === 'source') return sourceEntity === entity;
      return targetEntity === entity;
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
    return this.edges.filter(edge => this.filters.every(filter => filter(edge)));
  }

  #tagExists(tags: [string, string][], tagKey: string, tagValue?: string): boolean {
    return tags.some(([key, value]) => {
      return key === tagKey && (tagValue === undefined || value === tagValue);
    });
  }
}
