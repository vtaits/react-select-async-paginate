import type { Meta, StoryObj } from '@storybook/react';

import { SelectFetch } from '../src';

import { CreatableWithNewOptions } from './CreatableWithNewOptions';
import { InitialOptions } from './InitialOptions';
import { Manual } from './Manual';
import { ReloadOnError } from './ReloadOnError';
import { Simple } from './Simple';

const meta: Meta<typeof SelectFetch> = {
  title: 'react-select-fetch',
  component: SelectFetch,
};

export default meta;
type Story = StoryObj<typeof SelectFetch>;

export const CreatableWithNewOptionsStory: Story = {
  name: 'Creatable with new options',
  render: () => <CreatableWithNewOptions />,
};

export const InitialOptionsStory: Story = {
  name: 'Initial options',
  render: () => <InitialOptions />,
};

export const ManualStory: Story = {
  name: 'Manual control of input value and menu opening',
  render: () => <Manual />,
};

export const ReloadOnErrorStory: Story = {
  name: 'Reload on error',
  render: (props) => <ReloadOnError {...props} />,
};

export const SimpleStory: Story = {
  name: 'Simple',
  render: () => <Simple />,
};
