import { Badge, ChakraProvider } from '@chakra-ui/react';
import { StateEffect, StateField } from '@codemirror/state';
import { EditorView, Decoration, DecorationSet, WidgetType } from '@codemirror/view';
import { parse } from 'json-source-map';
import _ from 'lodash';
import { createRoot } from 'react-dom/client';

import { HelpBadge } from '@/machines/types';
import { theme } from '@/theme';

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
    // We need to get it to use the global top level ChakraProvider instead. maybe use a portal?
    root.render(
      <ChakraProvider theme={theme}>
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

/**
 * gets the line number for a given path in a JSON object
 * @param json gets the line number for a given path in a JSON object
 * @param path the path to the value in the JSON object, ie. `/Statement/0/Action/0`
 * @returns the line number for the path in the JSON object
 */
function getLineNumberForPath(json: object, path: string): number {
  const pointers = parse(JSON.stringify(json, null, 2), path).pointers;

  // +1 because CodeMirror uses 1-based indexing for lines
  return pointers[path].valueEnd.line + 1;
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
