import type { Meta, StoryObj } from '@storybook/react';

import { AsyncPaginate } from '../src';

import { Autoload } from './Autoload';
import { Creatable } from './Creatable';
import { CreatableWithNewOptions } from './CreatableWithNewOptions';
import { CustomScrollCheck } from './CustomScrollCheck';
import { Debounce } from './Debounce';
import { GroupedOptions } from './GroupedOptions';
import { InitialOptions } from './InitialOptions';
import { Manual } from './Manual';
import { RequestByPageNumber } from './RequestByPageNumber';
import { Simple } from './Simple';

const meta: Meta<typeof AsyncPaginate> = {
  title: 'react-select-async-paginate',
  component: AsyncPaginate,
};

export default meta;
type Story = StoryObj<typeof AsyncPaginate>;

export const AutoloadStory: Story = {
  name: 'Autoload',
  render: () => <Autoload />,
};

export const CreatableStory: Story = {
  name: 'Creatable',
  render: () => <Creatable />,
};

export const CreatableWithNewOptionsStory: Story = {
  name: 'Creatable with new options',
  render: () => <CreatableWithNewOptions />,
};

export const CustomScrollCheckStory: Story = {
  name: 'Customization check of the need of load options',
  render: () => <CustomScrollCheck />,
};

export const DebounceStory: Story = {
  name: 'Debounce',
  render: () => <Debounce />,
};

export const GroupedOptionsStory: Story = {
  name: 'Grouped options',
  render: () => <GroupedOptions />,
};

export const InitialOptionsStory: Story = {
  name: 'Initial options',
  render: () => <InitialOptions />,
};

export const ManualStory: Story = {
  name: 'Manual control of input value and menu opening',
  render: () => <Manual />,
};

export const RequestByPageNumberStory: Story = {
  name: 'Request by page number',
  render: () => <RequestByPageNumber />,
};

export const SimpleStory: Story = {
  name: 'Simple',
  render: () => <Simple />,
};
