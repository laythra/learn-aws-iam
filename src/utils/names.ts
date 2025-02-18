import _ from 'lodash';

export function formatNodeName(name: string): string {
  return _.snakeCase(name);
}

export function getEdgeName(source: string, target: string): string {
  return `e:${formatNodeName(source)}:${formatNodeName(target)}`;
}

// export function getNodeArn(nodeEntity: IAMNodeEntity, id: number): string {
//   return `arn:aws:iam::${id}:${formatNodeName(nodeEntity)}/${getNodeName(nodeEntity, id)}`;
// }
