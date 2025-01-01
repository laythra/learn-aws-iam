import { Badge, ChakraProvider } from '@chakra-ui/react';
import { StateEffect, StateField } from '@codemirror/state';
import { EditorView, Decoration, DecorationSet, WidgetType } from '@codemirror/view';
import _ from 'lodash';
import { createRoot } from 'react-dom/client';

import { HelpBadge } from '@/machines/types';

class BadgeWidget extends WidgetType {
  content: string;
  color: string;

  constructor(content: string, color: string) {
    super();
    this.content = content;
    this.color = color;
  }

  toDOM(): HTMLElement {
    const badgeElement = document.createElement('span');
    badgeElement.style.margin = '10px';
    const root = createRoot(badgeElement);

    // TODO: Defining the ChakraProvider here is a hack to get the Badge component to render properly
    // We need to get it to use the global top level ChakraProvider instead
    root.render(
      <ChakraProvider>
        <Badge colorScheme={this.color}>{this.content}</Badge>
      </ChakraProvider>
    );
    return badgeElement;
  }

  ignoreEvent(): boolean {
    return true;
  }
}

export const addBadge = StateEffect.define<{ line: number; content: string; color: string }>();

export const badgeExtension = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(badges, tr) {
    badges = badges.map(tr.changes);

    for (const effect of tr.effects) {
      if (effect.is(addBadge)) {
        const line = tr.state.doc.line(effect.value.line);
        const widget = Decoration.widget({
          widget: new BadgeWidget(effect.value.content, effect.value.color),
          side: 1,
        });
        badges = badges.update({
          add: [widget.range(line.to)],
        });
      }
    }

    return badges;
  },
  provide: f => EditorView.decorations.from(f),
});

type Json = { [key: string]: Json } | Json[] | string | number | boolean | object | null;

function getLineNumberForPath(json: Json, path: string): number | null {
  const resolvedValue = _.get(json, path);
  if (!resolvedValue) {
    throw new Error('Path does not exist');
    return null;
  }

  const jsonString = JSON.stringify(json, null, 2);
  const lines = jsonString.split('\n');

  // Split the path into parts, e.g., 'Statement[0].Action[0]' -> ['Statement', '0', 'Action', '0']
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let nestedJson: Json = json;
  let lineStartIndex = 0;

  for (const part of parts) {
    if (Array.isArray(nestedJson)) {
      const index = parseInt(part, 10);

      for (let start = 0, i = lineStartIndex; i < lines.length; i++, start++) {
        if (index == start) {
          lineStartIndex = i + 1;
          break;
        }
      }

      nestedJson = nestedJson[index];
    } else if (typeof nestedJson === 'object' && nestedJson !== null) {
      // Handle object keys
      const key = `"${part}"`;
      const regex = new RegExp(`^\\s*${key}\\s*:`);
      for (let i = lineStartIndex; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          lineStartIndex = i + 1;
          break;
        }
      }

      nestedJson = (nestedJson as { [key: string]: Json })[part];
    } else {
      return null; // Invalid path
    }
  }

  return lineStartIndex || null;
}

export const InitializeBadgeWidgets = (
  editorView: EditorView,
  badges: HelpBadge[],
  code: object
): void => {
  if (!badges.length) return;

  const effects = _.flatMap(badges, badge => {
    const lineNumber = getLineNumberForPath(code, badge.path);
    if (lineNumber === null) return [];

    return [addBadge.of({ line: lineNumber, content: badge.content, color: badge.color })];
  });

  editorView.dispatch({ effects });
};
