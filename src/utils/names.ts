import _ from 'lodash';

import { IAMNodeEntity } from '@/types';

const EDGE_LABELS: { [key: string]: string } = {
  [`${IAMNodeEntity.Policy}-${IAMNodeEntity.User}`]: 'Attached to',
  [`${IAMNodeEntity.Policy}-${IAMNodeEntity.Group}`]: 'Belongs to',
  [`${IAMNodeEntity.User}-${IAMNodeEntity.Group}`]: 'Attached to',
  [`${IAMNodeEntity.Role}-${IAMNodeEntity.User}`]: 'Assumed By',
  [`${IAMNodeEntity.Role}-${IAMNodeEntity.Resource}`]: 'Assumed By',
};

export function formatNodeName(name: string): string {
  return _.snakeCase(name);
}

export function getEdgeName(source: string, target: string): string {
  return `e:${formatNodeName(source)}:${formatNodeName(target)}`;
}

export function getEdgeLabel(sourceEntity: IAMNodeEntity, targetEntity: IAMNodeEntity): string {
  return EDGE_LABELS[`${sourceEntity}-${targetEntity}`] || 'Attached To';
}
