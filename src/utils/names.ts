import _ from 'lodash';
export function formatNodeName(name: string): string {
  return _.snakeCase(name);
}

export function getEdgeName(source: string, target: string): string {
  return `e:${formatNodeName(source)}:${formatNodeName(target)}`;
}
