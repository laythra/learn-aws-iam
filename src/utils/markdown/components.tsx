import * as React from 'react';

import { Code, Heading, Text, Tooltip, UnorderedList, Badge } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/system';
import { Components } from 'react-markdown';

export const components: Components = {
  p: ({ children }: JSX.IntrinsicElements['p']) => {
    let fontSize;
    const sizeRegex = /\|(xs|sm|md|lg|xl)$/;

    const processedChildren = React.Children.map(children, child => {
      if (typeof child === 'string' && child.match(sizeRegex)) {
        fontSize = child.match(sizeRegex)?.[1] || 'md';
        return child.replace(sizeRegex, '');
      }
      return child;
    });

    console.log(processedChildren);

    return (
      <Text fontSize={fontSize} py={1}>
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
    return <UnorderedList py={2}>{children}</UnorderedList>;
  },
  a: (props: JSX.IntrinsicElements['a']) => {
    const { children, href } = props;
    return (
      <Tooltip label={href} aria-label='link'>
        {children}
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
