const COLOR_DIRECTIVE_REGEX = /\|color\(([\w-]+)\)/i;

export const MARKDOWN_SUPPORTED_COLORS = new Set([
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
]);

export function resolveMarkdownColor(color: string | undefined, fallback: string): string {
  if (!color) return fallback;
  const normalized = color.toLowerCase();
  return MARKDOWN_SUPPORTED_COLORS.has(normalized) ? normalized : fallback;
}

export function extractColorDirective(content: string): {
  color: string | undefined;
  cleanedContent: string;
} {
  const match = content.match(COLOR_DIRECTIVE_REGEX);
  return {
    color: match?.[1]?.toLowerCase(),
    cleanedContent: content.replace(COLOR_DIRECTIVE_REGEX, ''),
  };
}
