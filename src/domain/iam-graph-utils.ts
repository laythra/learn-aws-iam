import _ from 'lodash';

import { IAMNodeEntity } from '@/types/iam-enums';

const EDGE_LABELS: { [key: string]: string } = {
  [`${IAMNodeEntity.IdentityPolicy}-${IAMNodeEntity.User}`]: 'Attached to',
  [`${IAMNodeEntity.IdentityPolicy}-${IAMNodeEntity.Group}`]: 'Attached to',
  [`${IAMNodeEntity.User}-${IAMNodeEntity.Group}`]: 'Member of',
  [`${IAMNodeEntity.Role}-${IAMNodeEntity.User}`]: 'Assumes',
  [`${IAMNodeEntity.Role}-${IAMNodeEntity.Resource}`]: 'Assumes',
};

export function formatNodeName(name: string): string {
  return _.snakeCase(name);
}

export function getEdgeName(source: string, target: string, attachedAs?: IAMNodeEntity): string {
  if (attachedAs) {
    return `e:${formatNodeName(source)}:${formatNodeName(target)}:${attachedAs}`;
  } else {
    return `e:${formatNodeName(source)}:${formatNodeName(target)}`;
  }
}

export function getEdgeLabel(sourceEntity: IAMNodeEntity, targetEntity: IAMNodeEntity): string {
  return (
    EDGE_LABELS[`${sourceEntity}-${targetEntity}`] ||
    EDGE_LABELS[`${targetEntity}-${sourceEntity}`] ||
    'Attached To'
  );
}

const IAM_NAME_MAX_LENGTHS: Partial<Record<IAMNodeEntity, number>> = {
  [IAMNodeEntity.User]: 64,
  [IAMNodeEntity.Role]: 64,
  [IAMNodeEntity.Group]: 128,
  [IAMNodeEntity.IdentityPolicy]: 128,
};

export const validateIAMName = (
  name: string,
  existingNames: string[],
  entity?: IAMNodeEntity
): string | undefined => {
  const maxLength = (entity !== undefined ? IAM_NAME_MAX_LENGTHS[entity] : undefined) ?? 64;
  if (existingNames.some(n => n.toLowerCase() === name.toLowerCase())) {
    return 'Name is already in use';
  }
  if (name.length < 1 || name.length > maxLength) {
    return `Name must be between 1 and ${maxLength} characters long`;
  }
  if (!/^[a-zA-Z0-9+=,.@_-]+$/.test(name)) {
    return 'Name can only contain letters, numbers, and the characters +=,.@_-';
  }
  return undefined;
};
