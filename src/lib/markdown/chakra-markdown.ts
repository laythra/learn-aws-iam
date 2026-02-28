import { Root, Parent, Text, Literal } from 'mdast';
import { visit } from 'unist-util-visit';

import { extractColorDirective, resolveMarkdownColor } from './color-directives';

interface ChakraBadgeNode extends Parent {
  type: 'element';
  tagName: string;
  properties: {
    as: string;
    content: string;
    colorScheme: string;
  };
  children: [];
}

interface TextNode extends Literal {
  type: 'text';
  value: string;
}

/**
 * A rehype plugin that transforms custom badge syntax into Chakra UI badge elements.
 *
 * This plugin processes text nodes in the markdown AST and replaces instances of the custom badge
 * syntax with element nodes that can be rendered as Chakra UI badges.
 *
 * Supported syntax:
 * - `::badge[content]::`
 * - `::badge[content|color(red)]::`
 *
 * @returns A transformer function that operates on the markdown AST (Abstract Syntax Tree)
 *
 * @example
 * ```markdown
 * This is some text with a ::badge[New]:: indicator.
 * This is some text with a ::badge[Warning|color(orange)]:: indicator.
 * ```
 *
 * The above will be transformed into a structure where "New" becomes a badge element.
 *
 * @remarks
 * The plugin searches for the pattern `::badge[content]::` in text nodes and replaces them
 * with element nodes containing:
 * - `type`: 'element'
 * - `tagName`: 'div'
 * - `properties.as`: 'badge'
 * - `properties.content`: The text content from within the brackets
 * - `properties.colorScheme`: Chakra color scheme extracted from `|color(...)`, or `green` by default
 *
 * Multiple badges in a single text node are supported, and surrounding text is preserved.
 */
export function rehypeChakraBadge() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      const regex = /::badge\[(.*?)\]::/g;
      const matches = [];
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        const rawContent = match[1] ?? '';
        const { color, cleanedContent } = extractColorDirective(rawContent);
        const text = cleanedContent.trim();
        const colorScheme = resolveMarkdownColor(color, 'green');

        matches.push({
          text,
          colorScheme,
          start: match.index,
          end: match.index + match[0].length,
        });
      }

      if (matches.length && Array.isArray(parent?.children)) {
        const children = [];
        let lastIndex = 0;

        matches.forEach(({ text, colorScheme, start, end }) => {
          if (start > lastIndex) {
            children.push({
              type: 'text',
              value: node.value.slice(lastIndex, start),
            });
          }

          children.push({
            type: 'element',
            tagName: 'div',
            properties: { as: 'badge', content: text, colorScheme },
            children: [],
          } as ChakraBadgeNode);

          lastIndex = end;
        });

        if (lastIndex < node.value.length) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex),
          } as TextNode);
        }

        parent.children.splice(index as number, 1, ...children);
      }
    });
  };
}
