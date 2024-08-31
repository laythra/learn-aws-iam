import { Root, Parent, Text, Literal } from 'mdast';
import { visit } from 'unist-util-visit';

// Define the types for the custom nodes
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

export function remarkChakra() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      const regex = /::badge\[(.*?)\]::/g;
      const matches = [];
      let match;

      // Find all matches for the custom badge syntax
      while ((match = regex.exec(node.value)) !== null) {
        matches.push({
          text: match[1],
          start: match.index,
          end: match.index + match[0].length,
        });
      }

      if (matches.length && Array.isArray(parent?.children)) {
        const children = [];
        let lastIndex = 0;

        matches.forEach(({ text, start, end }) => {
          if (start > lastIndex) {
            children.push({
              type: 'text',
              value: node.value.slice(lastIndex, start),
            });
          }

          children.push({
            type: 'element',
            tagName: 'div',
            properties: { as: 'badge', content: text },
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
