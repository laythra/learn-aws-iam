import { describe, expect, it } from 'vitest';

import {
  resolveMarkdownColor,
  extractColorDirective,
  MARKDOWN_SEMANTIC_COLORS,
  MARKDOWN_SUPPORTED_COLORS,
} from '@/lib/markdown/color-directives';

describe('resolveMarkdownColor', () => {
  it('returns fallback when color is undefined', () => {
    expect(resolveMarkdownColor(undefined, 'gray')).toBe('gray');
  });

  it('resolves a semantic color name', () => {
    expect(resolveMarkdownColor('warning', 'gray')).toBe('orange');
  });

  it('resolves semantic names case-insensitively', () => {
    expect(resolveMarkdownColor('WARNING', 'gray')).toBe('orange');
    expect(resolveMarkdownColor('Rule', 'gray')).toBe('green');
  });

  it('returns a supported Chakra color as-is', () => {
    expect(resolveMarkdownColor('blue', 'gray')).toBe('blue');
    expect(resolveMarkdownColor('purple', 'gray')).toBe('purple');
  });

  it('returns fallback for an unsupported color', () => {
    expect(resolveMarkdownColor('neon', 'gray')).toBe('gray');
  });

  it('returns fallback for empty string', () => {
    expect(resolveMarkdownColor('', 'blue')).toBe('blue');
  });
});

describe('extractColorDirective', () => {
  it('extracts color from a directive string', () => {
    const result = extractColorDirective('Some text|color(warning)');
    expect(result.color).toBe('warning');
    expect(result.cleanedContent).toBe('Some text');
  });

  it('returns undefined color when no directive present', () => {
    const result = extractColorDirective('Plain text');
    expect(result.color).toBeUndefined();
    expect(result.cleanedContent).toBe('Plain text');
  });

  it('handles case-insensitive directive', () => {
    const result = extractColorDirective('Text|Color(Blue)');
    expect(result.color).toBe('blue');
    expect(result.cleanedContent).toBe('Text');
  });

  it('handles directive at the end of content', () => {
    const result = extractColorDirective('Hello world|color(red)');
    expect(result.color).toBe('red');
    expect(result.cleanedContent).toBe('Hello world');
  });
});

describe('MARKDOWN_SEMANTIC_COLORS', () => {
  it('maps all expected semantic keys', () => {
    expect(MARKDOWN_SEMANTIC_COLORS).toHaveProperty('rule');
    expect(MARKDOWN_SEMANTIC_COLORS).toHaveProperty('warning');
    expect(MARKDOWN_SEMANTIC_COLORS).toHaveProperty('tip');
    expect(MARKDOWN_SEMANTIC_COLORS).toHaveProperty('note');
    expect(MARKDOWN_SEMANTIC_COLORS).toHaveProperty('advanced');
    expect(MARKDOWN_SEMANTIC_COLORS).toHaveProperty('core');
  });
});

describe('MARKDOWN_SUPPORTED_COLORS', () => {
  it('contains common Chakra color schemes', () => {
    expect(MARKDOWN_SUPPORTED_COLORS.has('red')).toBe(true);
    expect(MARKDOWN_SUPPORTED_COLORS.has('blue')).toBe(true);
    expect(MARKDOWN_SUPPORTED_COLORS.has('green')).toBe(true);
  });
});
