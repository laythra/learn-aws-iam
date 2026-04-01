import * as React from 'react';

import {
  Code,
  Divider,
  Heading,
  ListItem,
  Text,
  Tooltip,
  UnorderedList,
  Badge,
  OrderedList,
  Icon,
  Alert,
  AlertDescription,
} from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import * as HeroIcons from '@heroicons/react/24/solid';
import { Components } from 'react-markdown';

import { extractColorDirective, resolveMarkdownColor } from './color-directives';

interface MarkdownContextValue {
  fontSize: string;
  compact: boolean;
}

const MarkdownContext = React.createContext<MarkdownContextValue | null>(null);

interface MarkdownNode {
  properties?: {
    [key: string]: unknown;
    name?: string;
    content?: string;
    as?: string;
    colorScheme?: string;
  };
}

const DEFAULT_BLOCKQUOTE_COLOR = 'orange';

function resolveBadgeColor(colorScheme?: string): string {
  return resolveMarkdownColor(colorScheme, 'green');
}

function resolveBlockquoteColor(color?: string): string {
  return resolveMarkdownColor(color, DEFAULT_BLOCKQUOTE_COLOR);
}

/**
 * Extracts color directives from the children of a markdown element. It traverses the children recursively,
 * detecting any color directives and cleaning them from the content. The first detected color directive is returned,
 * along with the cleaned children content.
 * @param children
 * @returns An object containing the detected color (if any) and the cleaned children content without color directives.
 * @example
 *  Given the following markdown content:
 *  > |color(red)
 *  > This is a red blockquote.
 *
 *  The function will return:
 * {
 *   detectedColor: 'red',
 *   cleanedChildren: 'This is a red blockquote.'
 * }
 */
function extractColorFromChildren(children: React.ReactNode): {
  detectedColor: string | undefined;
  cleanedChildren: React.ReactNode;
} {
  let detectedColor: string | undefined;

  const cleanNode = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      const { color, cleanedContent } = extractColorDirective(node);
      if (!detectedColor && color) {
        detectedColor = color;
        return cleanedContent.trimStart();
      }

      return cleanedContent;
    }

    if (!React.isValidElement(node)) return node;

    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    if (element.props.children === undefined) return node;

    const cleaned = React.Children.map(element.props.children, cleanNode);
    return React.cloneElement(element, element.props, cleaned);
  };

  const cleanedChildren = React.Children.map(children, cleanNode);
  return { detectedColor, cleanedChildren };
}

export function createMarkdownComponents({
  defaultFontSize = 'md',
  defaultListFontSize = 'md',
}: { defaultFontSize?: string; defaultListFontSize?: string } = {}): Components {
  const defaultContext: MarkdownContextValue = {
    fontSize: defaultFontSize,
    compact: false,
  };

  const listContext: MarkdownContextValue = {
    fontSize: defaultListFontSize,
    compact: true,
  };

  const blockquoteContext: MarkdownContextValue = {
    fontSize: 'md',
    compact: true,
  };

  return {
    p: ({ children }: JSX.IntrinsicElements['p']) => {
      const ctx = React.useContext(MarkdownContext) ?? defaultContext;
      let fontColor = 'black';
      let fontWeight = 'normal';
      let fontSize = ctx.fontSize;

      const sizeRegex = /\|(xs|sm|md|lg|xl)$/;
      const weightRegex = /\|weight\((\d+)\)/;

      const { detectedColor, cleanedChildren } = extractColorFromChildren(children);
      if (detectedColor) {
        fontColor = resolveMarkdownColor(detectedColor, 'gray');
      }

      const processedChildren = React.Children.map(cleanedChildren, child => {
        if (typeof child !== 'string') return child;

        let str = child;

        const weightMatch = str.match(weightRegex);
        const sizeMatch = str.match(sizeRegex);

        if (weightMatch) {
          fontWeight = weightMatch[1] || 'normal';
          str = str.replace(weightRegex, '');
        }

        if (sizeMatch) {
          fontSize = sizeMatch[1] || 'md';
          str = str.replace(sizeRegex, '');
        }

        return str;
      });

      return (
        <Text
          fontSize={fontSize}
          py={ctx.compact ? 0.5 : 1.5}
          lineHeight={ctx.compact ? 'base' : 'tall'}
          fontWeight={fontWeight}
          color={fontColor}
        >
          {processedChildren}
        </Text>
      );
    },
    code: ({ children, ...props }: JSX.IntrinsicElements['code']) => {
      let isFullWidth = false;

      const processedChildren = React.Children.map(children, child => {
        if (typeof child === 'string' && child.includes('|fullwidth')) {
          isFullWidth = true;
          return child.replace('|fullwidth', '');
        }
        return child;
      });

      return (
        <Code
          display={isFullWidth ? 'block' : 'inline'}
          width={isFullWidth ? '100%' : 'auto'}
          px={0.5}
          py={0.5}
          fontSize={isFullWidth ? undefined : '0.85em'}
          whiteSpace='pre-wrap'
          {...props}
        >
          {processedChildren}
        </Code>
      );
    },
    pre: (props: JSX.IntrinsicElements['pre']) => {
      const { children } = props;
      return (
        <chakra.pre bg='gray.50' borderRadius='md' p={3} my={2} overflowX='auto'>
          {children}
        </chakra.pre>
      );
    },
    h1: (props: JSX.IntrinsicElements['h1']) => {
      const { children } = props;
      return (
        <Heading as='h1' size='2xl'>
          {children}
        </Heading>
      );
    },
    h2: (props: JSX.IntrinsicElements['h2']) => {
      const { children } = props;
      return (
        <Heading as='h2' size='xl'>
          {children}
        </Heading>
      );
    },
    h3: (props: JSX.IntrinsicElements['h3']) => {
      const { children } = props;
      return (
        <Heading as='h3' size='lg'>
          {children}
        </Heading>
      );
    },
    h4: (props: JSX.IntrinsicElements['h4']) => {
      const { children } = props;
      return (
        <Heading as='h4' size='md'>
          {children}
        </Heading>
      );
    },
    h5: (props: JSX.IntrinsicElements['h5']) => {
      const { children } = props;
      return (
        <Heading as='h5' size='md'>
          {children}
        </Heading>
      );
    },
    h6: (props: JSX.IntrinsicElements['h6']) => {
      const { children } = props;
      return (
        <Heading as='h6' size='xs'>
          {children}
        </Heading>
      );
    },
    ul: (props: JSX.IntrinsicElements['ul']) => {
      const { children } = props;
      return (
        <MarkdownContext.Provider value={listContext}>
          <UnorderedList py={1} pl={4}>
            {children}
          </UnorderedList>
        </MarkdownContext.Provider>
      );
    },
    ol: (props: JSX.IntrinsicElements['ol']) => {
      const { children } = props;
      return (
        <MarkdownContext.Provider value={listContext}>
          <OrderedList py={1} pl={4}>
            {children}
          </OrderedList>
        </MarkdownContext.Provider>
      );
    },
    a: (props: JSX.IntrinsicElements['a']) => {
      const { children, href } = props;
      return (
        <Tooltip label={href} aria-label='link'>
          <a
            {...props}
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            {children}
          </a>
        </Tooltip>
      );
    },
    span: ({ node, ...props }) => {
      if (node?.properties['as'] === 'badge') {
        const colorScheme = resolveBadgeColor(node?.properties?.colorScheme as string | undefined);
        return <Badge colorScheme={colorScheme}>{node?.properties.content}</Badge>;
      } else {
        return <span {...props} />;
      }
    },
    div: ({ node, ...props }) => {
      if (node?.properties['as'] === 'badge') {
        const colorScheme = resolveBadgeColor(node?.properties?.colorScheme as string | undefined);
        return (
          <Badge colorScheme={colorScheme} isTruncated maxW='100%'>
            {node?.properties.content}
          </Badge>
        );
      } else {
        return <div {...props} />;
      }
    },
    blockquote: ({ children }: JSX.IntrinsicElements['blockquote']) => {
      const { detectedColor, cleanedChildren } = extractColorFromChildren(children);
      const color = resolveBlockquoteColor(detectedColor);

      return (
        <MarkdownContext.Provider value={blockquoteContext}>
          <Alert
            status='info'
            variant='subtle'
            borderLeftWidth='4px'
            borderLeftColor={`${color}.500`}
            bg={`${color}.50`}
            color={`${color}.900`}
            borderRadius='sm'
            fontSize={blockquoteContext.fontSize}
            my={3}
          >
            <AlertDescription>{cleanedChildren}</AlertDescription>
          </Alert>
        </MarkdownContext.Provider>
      );
    },
    icon: ({ node, ...props }: { node?: MarkdownNode; [key: string]: unknown }) => {
      const iconName = node?.properties?.name as string;

      if (!iconName) {
        return null;
      }

      const IconComponent = HeroIcons[iconName as keyof typeof HeroIcons];

      if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in Heroicons`);
        return null;
      }

      return (
        <Icon
          as={IconComponent}
          display='inline-block'
          verticalAlign='middle'
          boxSize='1em'
          mx={1}
          {...props}
        />
      );
    },
    li: ({ children }: JSX.IntrinsicElements['li']) => {
      const ctx = React.useContext(MarkdownContext) ?? defaultContext;

      return (
        <ListItem fontSize={ctx.fontSize} py={0}>
          {children}
        </ListItem>
      );
    },
    hr: () => {
      return <Divider my={4} borderColor='gray.300' />;
    },
  } as Components;
}

export const customMarkdownComponents = createMarkdownComponents();
