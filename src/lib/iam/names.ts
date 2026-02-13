import snakeCase from 'lodash/snakeCase';

import { IAMNodeEntity } from '@/types/iam-enums';

const EDGE_LABELS: { [key: string]: string } = {
  [`${IAMNodeEntity.Policy}-${IAMNodeEntity.User}`]: 'Attached to',
  [`${IAMNodeEntity.Policy}-${IAMNodeEntity.Group}`]: 'Belongs to',
  [`${IAMNodeEntity.User}-${IAMNodeEntity.Group}`]: 'Attached to',
  [`${IAMNodeEntity.Role}-${IAMNodeEntity.User}`]: 'Assumed By',
  [`${IAMNodeEntity.Role}-${IAMNodeEntity.Resource}`]: 'Assumed By',
};

export function formatNodeName(name: string): string {
  return snakeCase(name);
}

export function getEdgeName(source: string, target: string, attachedAs?: IAMNodeEntity): string {
  if (attachedAs) {
    return `e:${formatNodeName(source)}:${formatNodeName(target)}:${attachedAs}`;
  } else {
    return `e:${formatNodeName(source)}:${formatNodeName(target)}`;
  }
}

export function getEdgeLabel(sourceEntity: IAMNodeEntity, targetEntity: IAMNodeEntity): string {
  return EDGE_LABELS[`${sourceEntity}-${targetEntity}`] || 'Attached To';
}

export const validateIAMName = (
  name: string,
  existingNames: string[],
  maxLength: number = 64 // default for users/groups/roles
): string | undefined => {
  if (existingNames.includes(name)) {
    return 'Name is already in use';
  }
  if (name.length < 1 || name.length > maxLength) {
    return `Name must be between 1 and ${maxLength} characters long`;
  }
  if (!/^[a-zA-Z0-9]/.test(name)) {
    return 'Name must start with a letter or number';
  }
  if (!/^[a-zA-Z0-9+=,.@_-]+$/.test(name)) {
    return 'Name can only contain letters, numbers, and the characters +=,.@_-';
  }
  return undefined;
};
