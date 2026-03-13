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

/**
 * Semantic badge labels mapped to their Chakra color scheme.
 * Used by both badges (auto-resolved by label) and blockquotes (via |color(semantic-name)).
 */
export const MARKDOWN_SEMANTIC_COLORS: Record<string, string> = {
  rule: 'green',
  core: 'blue',
  tip: 'teal',
  warning: 'orange',
  note: 'gray',
  advanced: 'purple',
};

/**
 * Resolves a color string to a valid Chakra color scheme.
 * Accepts both explicit Chakra color names and semantic names (e.g. "warning" → "orange").
 */
export function resolveMarkdownColor(color: string | undefined, fallback: string): string {
  if (!color) return fallback;
  const normalized = color.toLowerCase();

  if (Object.hasOwn(MARKDOWN_SEMANTIC_COLORS, normalized))
    return MARKDOWN_SEMANTIC_COLORS[normalized];
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
