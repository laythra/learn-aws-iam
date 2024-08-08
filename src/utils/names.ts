import _ from 'lodash';

import type { IAMNodeEntity } from '@/types';

export function formatNodeName(name: string): string {
  return _.snakeCase(name);
}

export function getNodeName(nodeEntity: IAMNodeEntity, id: number): string {
  return `${formatNodeName(nodeEntity)}_${id}`;
}

export function getEdgeName(source: string, target: string): string {
  return `e:${formatNodeName(source)}:${formatNodeName(target)}`;
}
