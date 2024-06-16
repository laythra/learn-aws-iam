import React from 'react';

import { StoryFn, Meta } from '@storybook/react';

import { MyButton, MyButtonProps } from './Button';

export default {
  title: 'Example/MyButton',
  component: MyButton,
} as Meta;

const Template: StoryFn<{ label: string; onClick: () => void; colorScheme: string }> = (
  args: MyButtonProps
) => <MyButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Button',
  colorScheme: 'teal',
  onClick: () => console.log('Button clicked!'),
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Secondary Button',
  colorScheme: 'red',
  onClick: () => console.log('Button clicked!'),
};
