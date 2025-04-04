import * as React from 'react';

import { Code, Heading, Text, Tooltip, UnorderedList, Badge, OrderedList } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/system';
import { Components } from 'react-markdown';

export const components: Components = {
  p: ({ children }: JSX.IntrinsicElements['p']) => {
    let fontColor = 'black';
    let fontWeight = 'normal';
    let fontSize = 'md';

    const sizeRegex = /\|(xs|sm|md|lg|xl)$/;
    const weightRegex = /\|weight\((\d+)\)/;
    const colorRegex = /\|color\((\w+)\)/;

    const processedChildren = React.Children.map(children, child => {
      if (typeof child !== 'string') return child;

      let str = child;

      const colorMatch = str.match(colorRegex);
      const weightMatch = str.match(weightRegex);
      const sizeMatch = str.match(sizeRegex);

      if (colorMatch) {
        fontColor = colorMatch[1] || 'gray';
        str = str.replace(colorRegex, '');
      }

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
      <Text fontSize={fontSize} py={1} fontWeight={fontWeight} color={fontColor}>
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
        p={isFullWidth ? 2 : 0}
        whiteSpace='pre-wrap'
        {...props}
      >
        {processedChildren}
      </Code>
    );
  },
  pre: (props: JSX.IntrinsicElements['pre']) => {
    const { children } = props;
    return <chakra.pre>{children}</chakra.pre>;
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
    return <UnorderedList py={1}>{children}</UnorderedList>;
  },
  ol: (props: JSX.IntrinsicElements['ol']) => {
    const { children } = props;
    return <OrderedList py={1}>{children}</OrderedList>;
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
      return <Badge colorScheme='green'>{node?.properties.content}</Badge>;
    } else {
      return <span {...props} />;
    }
  },
  div: ({ node, ...props }) => {
    if (node?.properties['as'] === 'badge') {
      return (
        <Badge colorScheme='green' isTruncated maxW='100%'>
          {node?.properties.content}
        </Badge>
      );
    } else {
      return <div {...props} />;
    }
  },
};
