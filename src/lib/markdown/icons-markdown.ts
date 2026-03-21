import { Root, Parent, Text, Literal } from 'mdast';
import { visit } from 'unist-util-visit';

interface IconNode extends Parent {
  type: 'element';
  tagName: string;
  properties: {
    name: string;
  };
  children: [];
}

interface TextNode extends Literal {
  type: 'text';
  value: string;
}

/**
 * A rehype plugin that transforms custom icon syntax (::icon[IconName]::) into icon elements.
 *
 * This plugin processes text nodes in the markdown AST and replaces instances of the custom icon
 * syntax with element nodes that can be rendered as Heroicons.
 *
 * @returns A transformer function that operates on the markdown AST (Abstract Syntax Tree)
 *
 * @example
 * ```markdown
 * Click the ::icon[EyeIcon]:: to view details.
 * ```
 *
 * The above will be transformed into an element node where "EyeIcon" becomes an icon component.
 *
 * @remarks
 * The plugin searches for the pattern `::icon[IconName]::` in text nodes and replaces them
 * with element nodes containing:
 * - `type`: 'element'
 * - `tagName`: 'icon'
 * - `properties.name`: The icon name from within the brackets
 *
 * Multiple icons in a single text node are supported, and surrounding text is preserved.
 */
export function rehypeIcon() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      const regex = /::icon\[(.*?)\]::/g;
      const matches = [];
      let match;

      // Find all matches for the custom icon syntax
      while ((match = regex.exec(node.value)) !== null) {
        matches.push({
          iconName: match[1],
          start: match.index,
          end: match.index + match[0].length,
        });
      }

      if (matches.length && Array.isArray(parent?.children)) {
        const children = [];
        let lastIndex = 0;

        matches.forEach(({ iconName, start, end }) => {
          if (start > lastIndex) {
            children.push({
              type: 'text',
              value: node.value.slice(lastIndex, start),
            });
          }

          children.push({
            type: 'element',
            tagName: 'icon',
            properties: { name: iconName },
            children: [],
          } as IconNode);

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
