import _ from 'lodash';

type Json = { [key: string]: Json } | Json[] | string | number | boolean | object | null;

export function getLineNumberForPath(json: Json, path: string): number | null {
  const resolvedValue = _.get(json, path);
  if (resolvedValue === undefined) {
    return null;
  }

  const jsonString = JSON.stringify(json, null, 2);
  const lines = jsonString.split('\n');

  // Traverse the path parts to find the last key's line number
  const parts = path.split(/\.|\[|\]/).filter(Boolean); // Split path into parts
  let nestedJson = json;
  let lineStartIndex = 0;

  for (const part of parts) {
    const key = Array.isArray(nestedJson) ? `[${part}]` : `"${part}"`;
    const regex = new RegExp(`^\\s*${key.replace(/[\[\]]/g, '\\$&')}\\s*:`);
    for (let i = lineStartIndex; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        lineStartIndex = i + 1; // Update starting index for the next part
        break;
      }
    }

    if (Array.isArray(nestedJson)) {
      nestedJson = nestedJson[parseInt(part, 10)];
    } else if (typeof nestedJson === 'object' && nestedJson !== null && part in nestedJson) {
      nestedJson = (nestedJson as { [key: string]: Json })[part];
    } else {
      return null;
    }
  }

  return lineStartIndex || null;
}
