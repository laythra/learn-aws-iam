import * as React from 'react';

import { Code, Heading, Text, UnorderedList } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/system';
import { Components } from 'react-markdown';

export const defaults: Components = {
  p: (props: JSX.IntrinsicElements['p']) => {
    const { children } = props;
    return <Text fontSize='lg'>{children}</Text>;
  },
  code: (props: JSX.IntrinsicElements['code']) => {
    const { children } = props;
    return <Code>{children}</Code>;
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
  ul: (props: JSX.IntrinsicElements['ul']) => {
    const { children } = props;
    return <UnorderedList>{children}</UnorderedList>;
  },
};
