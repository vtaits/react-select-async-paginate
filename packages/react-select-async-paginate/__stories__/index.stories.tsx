import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { AsyncPaginate } from "../src";

import { Autoload } from "./Autoload";
import { Creatable } from "./Creatable";
import { CreatableWithNewOptions } from "./CreatableWithNewOptions";
import { CustomScrollCheck } from "./CustomScrollCheck";
import { Debounce } from "./Debounce";
import { GroupedOptions } from "./GroupedOptions";
import { InitialOptions } from "./InitialOptions";
import { Manual } from "./Manual";
import { RequestByPageNumber } from "./RequestByPageNumber";
import { Simple, loadOptions } from "./Simple";
import { playSimple } from "./SimpleTestStory";

const meta: Meta<typeof AsyncPaginate> = {
  title: "react-select-async-paginate",
  component: AsyncPaginate,
  tags: ["autoload"],
};

export default meta;
type Story = StoryObj<typeof AsyncPaginate>;

export const AutoloadStory: Story = {
  name: "Autoload",
  render: (props) => <Autoload {...props} />,
};

export const CreatableStory: Story = {
  name: "Creatable",
  render: (props) => <Creatable {...props} />,
};

export const CreatableWithNewOptionsStory: Story = {
  name: "Creatable with new options",
  render: (props) => <CreatableWithNewOptions {...props} />,
};

export const CustomScrollCheckStory: Story = {
  name: "Customization check of the need of load options",
  render: (props) => <CustomScrollCheck {...props} />,
};

export const DebounceStory: Story = {
  name: "Debounce",
  args: {
    debounceTimeout: 300,
  },
  render: (props) => <Debounce {...props} />,
};

export const GroupedOptionsStory: Story = {
  name: "Grouped options",
  render: (props) => <GroupedOptions {...props} />,
};

export const InitialOptionsStory: Story = {
  name: "Initial options",
  render: (props) => <InitialOptions {...props} />,
};

export const ManualStory: Story = {
  name: "Manual control of input value and menu opening",
  render: (props) => <Manual {...props} />,
};

export const RequestByPageNumberStory: Story = {
  name: "Request by page number",
  render: (props) => <RequestByPageNumber {...props} />,
};

export const SimpleStory: Story = {
  name: "Simple",
  render: (props) => <Simple {...props} />,
};

export const SimpleTestStory: Story = {
  name: "Simple (test)",
  play: playSimple,
  args: {
    loadOptions: fn(loadOptions),
  },
  render: (props) => <Simple {...props} />,
};
